"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { File, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  // Use z.union to ensure that either videoUrl or testUrl is provided
  url: z.union([
    z.object({ videoUrl: z.string().min(1) }),
    z.object({ testUrl: z.string().min(1) })
  ])
});


export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isTest,setIsTest] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleTest =()=>setIsTest((current)=>!current)

  const router = useRouter();
  

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { videoUrl, testUrl } = (values.url || {}) as { videoUrl?: string; testUrl?: string };


    // Check if videoUrl or testUrl is present and set urlToSend accordingly
    if (videoUrl) {
     const values = {videoUrl:videoUrl};
     console.log("sending a video file")
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();


    } else if (testUrl) {
      const values = {testUrl:testUrl};
      console.log("send a test file")
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    }


      
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <Button onClick={toggleTest} >
        {isTest?(<>This is a test</>):(<>This is a chapter</>)}
        
      </Button>
      {isTest?(
        <div className="font-medium flex items-center justify-between">
        Chapter test
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a test file
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit edit test file
            </>
          )}
        </Button>
      </div>
      ):(<div className="font-medium flex items-center justify-between">
      Chapter video
      <Button onClick={toggleEdit} variant="ghost">
        {isEditing && (
          <>Cancel</>
        )}
        {!isEditing && !initialData.videoUrl && (
          <>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add a video
          </>
        )}
        {!isEditing && initialData.videoUrl && (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit video
          </>
        )}
      </Button>
    </div>)}
     
      {!isEditing && !isTest ?(
        !initialData.videoUrl ? (
          null
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
            />
          </div>
        )
      ):(
        !initialData.testUrl ? (
            null
        ) : (
          <div className="relative aspect-video mt-2">
            <p>
              {initialData.testUrl}
            </p>
          </div>
        )   
      )}


      {isEditing && !isTest ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ url:{videoUrl:url} });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
           Upload this chapter&apos;s video
          </div>
        </div>
      ):(
        <div>
        <FileUpload
          endpoint="chapterTest"
          onChange={(url) => {
            if (url) {
              onSubmit({ url:{testUrl:url} });
            }
          }}
        />
        <div className="text-xs text-muted-foreground mt-4">
         Upload this chapter&apos;s video or test
        </div>
      </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  )
}