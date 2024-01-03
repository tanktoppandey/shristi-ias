import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";
import NodeCache from 'node-cache';
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { any } from "zod";
import MCQComponent from "./_components/test-player";

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}


const cache = new NodeCache();


const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    return redirect("/");
  } 

  let questions: MCQ[] = [];

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  

  if (!chapter || !course) {
    return redirect("/")
  }

  async function extractMCQsFromArrayBuffer(fileBuffer: ArrayBuffer): Promise<Array<MCQ>> {
    const decoder = new TextDecoder('utf-8');
    const fileContent = decoder.decode(new Uint8Array(fileBuffer));

    // Split the content based on lines starting with "Question"
    const mcqBlocks = fileContent.split(/(?=Question \d+:)/).filter(Boolean);

    console.log('Number of question blocks:', mcqBlocks.length);

    const mcqArray: Array<MCQ> = mcqBlocks.map((block) => {
        const lines = block.split('\n').filter(Boolean);

        const question = lines[0].trim();
        const options = lines.slice(1, 5).map(option => option.trim());
        const correctAnswer = lines.find(line => line.startsWith('Answer:'))!.replace('Answer:', '').trim();
        const explanation = lines.find(line => line.startsWith('Explanation:'))!.replace('Explanation:', '').trim();

        return {
            question,
            options,
            correctAnswer,
            explanation,
        };
    });

    return mcqArray;
}
  

  if(chapter.testUrl){
    try{
      const cachedTestFile = cache.get(chapter.testUrl);

      if (!cachedTestFile) {
        const response = await fetch(chapter.testUrl);
        const arrayBuffer = await response.arrayBuffer();
        // Convert the array buffer to a blob
       // const blob = new Blob([arrayBuffer], { type: 'application/msword' });
        console.log(chapter.testUrl)

        // Save the blob in the cache with a specific expiration time (e.g., 10 minutes)
        cache.set(chapter.testUrl, arrayBuffer, 600);
        questions = await extractMCQsFromArrayBuffer(arrayBuffer);
        console.log('File fetched and cached');

      } else {
        console.log('File found in cache');
      }

      }
    catch(e){
      console.log('error :',e)
    }
  }

  
 
  
 


  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return ( 
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          { muxData?(
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />):
          (chapter.testUrl? (<MCQComponent questions={questions}/>):(<p>No test for this chapter</p>))
          }
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
   );
}
 
export default ChapterIdPage;