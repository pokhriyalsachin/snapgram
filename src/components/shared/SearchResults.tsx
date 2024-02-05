import { SearchResultProps } from '@/_root/pages/Explore'
import { Loader } from './Loader'
import GridPostList from './GridPostList'

const SearchResults = ({ isSearchFetching,  searchPosts}:SearchResultProps) => {
  if(isSearchFetching){
    return (
      <Loader></Loader>
    )
  }
 
  else if(searchPosts && searchPosts.documents.legnth >0) {
    
    return (
      <GridPostList posts={searchPosts.documents} />
    )
  }else{
    console.log(searchPosts);
  // no search post so resturn No found
  return (
    <p className='text-light-4 mt-10 text-center w-full'>
      No result Found
    </p>
  )
  }
}

export default SearchResults