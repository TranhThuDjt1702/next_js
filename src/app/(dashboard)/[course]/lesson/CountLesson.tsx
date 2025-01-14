'use client'
import lessonChecked, { deleteHistory } from '@/lib/actions/history.action';
import React, { useEffect } from 'react'

const CountLesson = ({plainHistories, plainLessonExist}:{
    plainHistories: any,
    plainLessonExist: any
}) => {
  useEffect(() => {
    const checkLessons = async () => {
      for (const history of plainHistories) {
        const course = history.course;
        const lesson = history.lesson;
        const checked = await lessonChecked({ course, lesson });
        if(!checked){
          await deleteHistory({course, lesson})
        }
      }
    };
    checkLessons();
  }, [plainLessonExist]);
    const percentComplete =
    (plainHistories?.length / plainLessonExist?.length) * 100;
    console.log("percentComplete: ", percentComplete);
  return (
   
      <div
        className="absolute top-0 left-0 bg-purple-700 h-full z-20 rounded-full"
        style={{ width: `${percentComplete}%` }}
      ></div>
   
  )
}

export default CountLesson
