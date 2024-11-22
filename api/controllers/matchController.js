import { User } from "../models/User.js";
// DisLike에 추가하기
export const swipeLeft = async (req, res) => {
  const { dislikedUserId } = req.params;
  try {
    const currentUser = await User.findById(req.user.id);
    // 현재 User DisLikes에 넣어서 값 저장해주기
    if (currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      // 변경된 사항 데이터 베이스에 저장해주기
      await currentUser.save();
    }

    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    console.log("ERROR IN SwipeLeft Function: ", error.message);
    res
      .status(400)
      .json({ success: false, message: "INTERNAL ERROR @swipeLeft Logic" });
  }
};
// Like에 추가하기
export const swipeRight = async (req, res) => {
  try {
    // 현재 user 찾고 오른쪽으로 swipe한 유저 찾기
    const { likedUserId } = req.params;
    // 현재 포함되어있는지 안되어있는지 확인하기
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();
    }

    // 매치가 성사되는경우
    if (likedUser.likes.includes(currentUser.id)) {
      currentUser.matches.push(likedUserId);
      likedUser.matches.push(currentUser.id);
      //  동시에 업데이트 해주기
      await Promise.all([await currentUser.save(), await likedUser.save()]);
    }
    // TODO SEND NOTIFICATION IF IT IS A MATCH => SOCKET.IO

    return res
      .status(200)
      .json({ success: true, message: "User Likes added successfully" });
  } catch (error) {
    console.log("ERROR IN SWIPE RIGHT", error.message);
    return res
      .status(400)
      .json({ success: false, message: "INTERNAL ERROR IN swipeRight" });
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );
    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (error) {
    console.log("Error in getMatches: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error  @getMatches",
    });
  }
};

// ✅ 제외되는 항목들
// 자기자신
// 좋아요 누른사람
// 안좋아요 누른사람

// 다른사람들 프로파일 가져오기
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    // 랜덤 항목에 나오는 유저
    const users = await User.find({
      $and: [
        // 현재 User
        { _id: { $ne: currentUser.id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } },
      ],
    });
    return res.status(200).json({ success: true, users: users });
  } catch (error) {
    console.log("Error in getUserProfiles: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
