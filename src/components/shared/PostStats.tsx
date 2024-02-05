import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "./Loader";
import { useEffect, useState } from "react";
type postStatsProps={
    post?: Models.Document;
    userId: string;
}

const PostStats = ({post, userId} : postStatsProps) => {
  const likeList = post?.likes.map((user:Models.Document)=> user.$id);
  const [likes, setLikes] = useState<string[]>(likeList);
  const [isSaved, setIsSaved] = useState(false);
  const {mutate:likePost} = useLikePost();
  const {mutate:SavePost , isLoading: isSavingPost} = useSavePost();
  const {mutate:deleteSavedPost , isLoading: isDeletingSaved} = useDeleteSavedPost();
  const {data: currentUser} = useGetCurrentUser();
  const SavePostRecord = currentUser?.save.find((record: Models.Document)=> record.post.$id === post?.$id);

  // ek useffect called whrn current user changees
  useEffect(()=>{
    setIsSaved(!!SavePostRecord);
  },[currentUser])
  const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>)=>{
    console.log("tyesf");
    e.stopPropagation();
    
    let newLikes = [...likes];
    const hasLiked= newLikes.includes(userId);
    if(hasLiked){
      newLikes= newLikes.filter((id) => id!==userId);
    }else{
      newLikes.push(userId);
    }
    setLikes(newLikes);
    // iss array ko save karado
    likePost({postId: post?.$id || '' , likesArray:newLikes});
  }
  const handleSavePost = (e: React.MouseEvent)=>{
    e.stopPropagation();
   
    
    if(SavePostRecord){
      setIsSaved(false);
      deleteSavedPost(SavePostRecord.$id);
    }else{
      SavePost({postId:post?.$id || '' , userId});
      setIsSaved(true);
    }
  }

 

  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`} alt="like" width={20} height={20} onClick={handleLikePost} className="cursor-pointer"/>

           <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
        <div className="flex gap-2">
        { isSavingPost || isDeletingSaved ? <Loader/> :<img src={`${isSaved? "/assets/icons/saved.svg": "/assets/icons/save.svg"}`} alt="like" width={20} height={20}  onClick={(e) => handleSavePost(e)} className="cursor-pointer"/>}
        </div>

    </div>
  )
}

export default PostStats

