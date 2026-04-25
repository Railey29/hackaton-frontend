import React from 'react';

type AvatarCircleProps = {
  initials: string;
  avatarColor: string;
};

export function AvatarCircle({ initials, avatarColor }: AvatarCircleProps) {
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-600 font-medium ${avatarColor}`}>
      {initials}
    </div>
  );
}
