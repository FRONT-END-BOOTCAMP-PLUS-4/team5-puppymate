'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import useRecordingMapStore from '@/store/useRecordingMapStore';
import SnapShotMap, { SnapShotMapSkeleton } from '@/app/components/map/SnapShotMap';
import { saveCourse } from '@/lib/saveCourse';

interface SaveCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SaveCourseModal({ open, onOpenChange }: SaveCourseModalProps) {
  const [courseName, setCourseName] = useState('');

  const { clearCourse, stopRecordingCourse, coordinates } = useRecordingMapStore();

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseName(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>산책로 저장</DialogTitle>
          <DialogDescription>산책로 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input name="name" placeholder="산책로 이름" onChange={handleNameInputChange} />
        </div>
        {open ? <SnapShotMap coordinates={coordinates} size={300} /> : <SnapShotMapSkeleton size={300} />}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                clearCourse();
                stopRecordingCourse();
                onOpenChange(false);
              }}
              variant="secondary">
              산책로 초기화
            </Button>
          </DialogClose>
          <Button
            onClick={async () => {
              const courseId = await saveCourse(courseName);
              if (courseId) {
                clearCourse();
                stopRecordingCourse();
                onOpenChange(false);
              }
            }}
            className="bg-orange-400">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
