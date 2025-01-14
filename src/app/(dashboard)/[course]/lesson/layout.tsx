import React, { Suspense } from "react";
import LoadingPlayer from "./@player/LoadingPlayer";
import LoadingOutline from "./@outline/LoadingOutline";
import LessonWraper from "./LessonWraper";

const layout = async ({
  player,
  outline,
}: {
  player: React.ReactNode;
  outline: React.ReactNode;
}) => {
  return (
    <LessonWraper>
      <Suspense fallback={<LoadingPlayer />}>{player}</Suspense>
      <Suspense fallback={<LoadingOutline />}>{outline}</Suspense>
    </LessonWraper>
  );
};

export default layout;
