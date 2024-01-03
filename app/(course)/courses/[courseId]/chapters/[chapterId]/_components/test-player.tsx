'use client'
import { Button } from '@/components/ui/button';
import { Ghost } from 'lucide-react';
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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [isSubmitted , setSubmitted] =useState(false)
  const [isRevisit,setIsRevisit] =useState(false)

  const currentQuestion = questions[currentQuestionIndex];
  const selectedQuestion =
    selectedQuestionIndex !== null ? questions[selectedQuestionIndex] : null;

  const handleAnswerSelect = (answer: string, question: string) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer,
    }));
  };

  useEffect(() => {
    console.log('MCQComponent mounted');
  
    return () => {
      console.log('MCQComponent unmounted');
    };
  }, [questions]);
  
  const handleNextQuestion = () => {
    setSelectedQuestionIndex(null);
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handlePreviousQuestion = () => {
    setSelectedQuestionIndex(null);
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    setCurrentQuestionIndex(index);
  };
  
  const onMcqSubmit = ()=>{

  }

  return (
    <>
    {isSubmitted?(
        isRevisit?(
          null
          ):
        (
          <div className='flex flex-col gap-y-2'>
            <p> Total Marks</p>
            <p> Your Score</p>
            <p>Correct Answer</p>
            <Button variant='ghost' />

          </div>
        )
      )
      :(
        <div className=' flex flex-col'>
        {/* Render the current or selected question based on the state */}
        {questions?((currentQuestion || selectedQuestion) && (
          <div key={(currentQuestion || selectedQuestion).question} className="mb-4">
            <h4 className="font-semibold">{(currentQuestion || selectedQuestion).question}</h4>
            <div>
              {(currentQuestion || selectedQuestion).options.map((option, optionIndex) => (
                <label
                  key={`${(currentQuestion || selectedQuestion).question}_${optionIndex}`}
                  className={`block my-2 ${
                    selectedAnswers[(currentQuestion || selectedQuestion).question] === option
                      ? 'bg-gray-200 border border-gray-400 p-2 rounded'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question_${(currentQuestion || selectedQuestion).question}_${optionIndex}`}
                    value={option}
                    checked={
                      selectedAnswers[(currentQuestion || selectedQuestion).question] === option
                    }
                    onChange={() =>
                      handleAnswerSelect(option, (currentQuestion || selectedQuestion).question)
                    }
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )):(<p>no question data yet</p>)}
  
        {/* Question List Section */}
        <div className="mt-4">
          <h4 className="font-semibold">Question List</h4>
          <ul className="flex space-x-2">
            {questions.map((_, index) => (
              <li key={questions[index].question}>
                <button
                  className={`border border-gray-400 px-2 rounded ${
                    selectedQuestionIndex === index ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => handleSelectQuestion(index)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="flex justify-between mt-4">
          <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>
        </div>
  
        <div className="mt-4">
          <button
            onClick={() => console.log('Submitted Answers:', selectedAnswers)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
      )}
    
    
    </>
  );
};

export default MCQComponent;
 