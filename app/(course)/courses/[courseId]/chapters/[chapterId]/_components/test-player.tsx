'use client'
import { Button } from '@/components/ui/button';
import { Ghost, NfcIcon } from 'lucide-react';
import React, { useState ,useEffect} from 'react';

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface MCQComponentProps {
  questions: MCQ[];
}

const MCQComponent: React.FC<MCQComponentProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted , setSubmitted] =useState(false)
  const [isRevisit,setIsRevisit] =useState(false)
  const reference:any ={'a':0,'b':1,'c':2,'d':3}
  const [scoreNum,setScore]=useState(0)
 

  useEffect(() => {
    console.log('MCQComponent mounted');
  
    return () => {
      console.log('MCQComponent unmounted');
    };
  }, [questions]);
  

  
  const changeCurrentQuestion= ()=>{
    setCurrentQuestionIndex(currentQuestionIndex+1)
  }

  const previousQuestion =() =>{
    setCurrentQuestionIndex(currentQuestionIndex-1)
  }

  const setClickedOption= (index:Number)=>{
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [currentQuestionIndex]: index,
    }));
  }


  const onMcqSubmit = () => {
    console.log(selectedAnswers);

    let score = 0;
    const correctAnswersLog: number[] = [];
    const incorrectAnswersLog: number[] = [];

    questions.forEach((question, index) => {
      const selectedAnswerIndex = selectedAnswers[index];
      const correctAnswerIndex = reference[question.correctAnswer.toLowerCase()];

      if (selectedAnswerIndex === correctAnswerIndex) {
        score += 1;
        correctAnswersLog.push(index + 1); // Log the question number (1-based)
      } else {
        incorrectAnswersLog.push(index + 1); // Log the question number (1-based)
      }
    });
    setScore(score)
    setSubmitted(true)

    console.log('Score:', score);
    console.log('Correctly answered questions:', correctAnswersLog);
    console.log('Incorrectly answered questions:', incorrectAnswersLog);
  };


  return(
    <div className='flex flex-col gap-y-1'>
      {questions && !isSubmitted?(
      <>
      <div>
         <p>{questions[currentQuestionIndex].question?(questions[currentQuestionIndex].question):(null)}</p>
      </div>
      <div className='flex flex-col gap-y-2'>
            {questions[currentQuestionIndex].options.map((option,i)=>(
              <Button
              key={i}
              onClick={() => setClickedOption(i)}
              style={{ backgroundColor: selectedAnswers[currentQuestionIndex] === i ? 'lightblue' : 'white' }}
              variant='outline'>
                {option}
              </Button>
            ))}
      </div>
      <div className=' flex flex-row justify-between py-2'>

              {currentQuestionIndex<=0 ?(null):(<Button onClick={previousQuestion}>Previous</Button>)}
              {currentQuestionIndex>=questions.length-1 ?(<Button onClick={onMcqSubmit}>Submit</Button>):(<Button onClick={changeCurrentQuestion}>Next</Button>)}
              
      </div>
      {isRevisit?(<div className='flex'>
          {questions[currentQuestionIndex].explanation}
      </div>):(null)}
      </>):(
        <>
        <div className='flex flex-col gap-y-2 item-center justify-center text-center'>
          <p className='py-5'>Score:{scoreNum}</p>
        </div>
        <div className='flex flex-row justify-between'>
          <Button>Solution</Button>
          <Button>Retest</Button>
        </div>
        </>
      )}
    </div>
  )
};

export default MCQComponent;
 