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
import { useState } from 'react';
import useMapStore from '@/store/useMapStore';
import SnapShotMap from '@/app/components/map/SnapShotMap';
import { saveCourse } from '@/lib/saveCourse';

interface SaveCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SaveCourseModal({ open, onOpenChange }: SaveCourseModalProps) {
  const [courseName, setCourseName] = useState('');
  const { clearCourse, stopRecordingCourse, coordinates } = useMapStore();

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseName(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>경로 저장</DialogTitle>
          <DialogDescription>경로 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input name="name" placeholder="코스 이름" onChange={handleNameInputChange} />
        </div>
        {open && <SnapShotMap coordinates={coordinates} size={300} />}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                clearCourse();
                stopRecordingCourse();
                onOpenChange(false);
              }}
              variant="secondary">
              경로 초기화
            </Button>
          </DialogClose>
          <Button
            onClick={async () => {
              stopRecordingCourse();
              const courseId = await saveCourse(courseName);
              if (courseId) {
                onOpenChange(false);
              }
            }}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
