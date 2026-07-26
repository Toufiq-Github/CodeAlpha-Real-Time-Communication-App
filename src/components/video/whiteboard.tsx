
'use client';

import { useState, useRef, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, orderBy, limit, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Download, Eraser, MousePointer2 } from 'lucide-react';
import { WhiteboardPath } from '@/lib/types';

interface WhiteboardProps {
  roomId: string;
  userId: string;
  onClose: () => void;
}

export function Whiteboard({ roomId, userId, onClose }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6366f1');
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  
  const db = useFirestore();
  const whiteboardQuery = query(collection(db, 'rooms', roomId, 'whiteboard'), orderBy('createdAt', 'asc'));
  const { data: paths } = useCollection<WhiteboardPath>(whiteboardQuery);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw all paths
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths?.forEach(path => {
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      path.points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
  }, [paths]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    setPoints([pos]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    setPoints(prev => [...prev, pos]);
  };

  const stopDrawing = async () => {
    if (!isDrawing || points.length < 2) {
      setIsDrawing(false);
      return;
    }
    
    setIsDrawing(false);
    await addDoc(collection(db, 'rooms', roomId, 'whiteboard'), {
      userId,
      color,
      points,
      createdAt: new Date().toISOString()
    });
    setPoints([]);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  return (
    <div className="w-full h-full bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#ffffff'].map(c => (
              <button 
                key={c}
                className={`h-6 w-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="w-px h-6 bg-white/10" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs font-bold gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}
