import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { toast, useToast } from "../ui/use-toast"
import { PostValidation } from "@/lib/validation"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"


const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
type PostformProps={
  post?: Models.Document,
  action: "Create" | "update";
}
const PostForms = ({post , action}:PostformProps) => {
  const { user } =useUserContext();
  const { toast } = useToast();
  const navigate =useNavigate();
   const {mutateAsync: createPost , isLoading: isLoadingCreate} = useCreatePost();
   const {mutateAsync: updatePost , isLoading: isLoadingUpdate} = useUpdatePost();
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
          caption: post? post?.caption:"",
          file: [],
          location: post? post?.location: "",
          tags: post? post.tags.join(','): '',
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof PostValidation>) {
        if (post && (action === "update")) {
          const updatedPost = await updatePost({
            ...values,
            postId: post.$id,
            imageId: post.imageId,
            imageUrl: post.imageUrl,
          });
    
          if (!updatedPost) {
            toast({
              title: `${action} post failed. Please try again.`,
            });
          }
          return navigate(`/posts/${post.$id}`);
        }
    
        // ACTION = CREATE
        
        const newPost = await createPost({
          ...values,
          userId: user.id,
        });
    
        if (!newPost) {
          toast({
            title: `${action} post failed. Please try again.`,
          });
        }
        navigate("/");
      };
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
      <FormField
        control={form.control}
        name="caption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Caption</FormLabel>
            <FormControl>
              <Textarea className="shad-textarea custom-scrollbar" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message">
            </FormMessage>
           
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Photos</FormLabel>
            <FormControl>
             <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl}/>
            </FormControl>
            <FormMessage className="shad-form_message">
            </FormMessage>
           
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Location</FormLabel>
            <FormControl>
             <Input type="text" className="shad-input" {...field}></Input>
            </FormControl>
            <FormMessage className="shad-form_message">
            </FormMessage>
           
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Tags(seperated by comma " , ")</FormLabel>
            <FormControl>
             <Input type="text" className="shad-input" placeholder="Art, Expression, Learn, React, Next-js" {...field}></Input>
            </FormControl>
            <FormMessage className="shad-form_message">
            </FormMessage>
           
          </FormItem>
        )}
      />
      <div className="flex gap-4 items-center justify-end">
      <Button type="button" className="shad-button_dark_4">
        Cancel
        </Button>
      <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate||isLoadingUpdate}>
        {isLoadingCreate || isLoadingUpdate && 'Loading...'} {action} Post
      </Button>
    </div>
    </form>
  </Form>
  )
}

export default PostForms