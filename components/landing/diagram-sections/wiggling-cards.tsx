import React, { useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  type PanInfo,
} from 'motion/react';
import {
  ArrowUpRight,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { FloatingPopover } from '@/components/ui/floating-popover';

export interface CardData {
  id: number;
  question: string;
  answer: string;
}



const DRAG_BUFFER = 60;
const VELOCITY_THRESHOLD = 500;

const WigglingCard = ({ card, i, x, cardWidth, gap }: any) => {
  const Icon = card.icon;
  const center = -(i * (cardWidth + gap));

  const distance = useTransform(x, (v: number) => v - center);

  const rotate = useTransform(
    distance,
    [-cardWidth, -cardWidth * 0.1, 0, cardWidth * 0.1, cardWidth],
    [10, 10, 0, -10, -10],
  );

  const blur = useTransform(
    distance,
    [-cardWidth, -cardWidth * 0.2, 0, cardWidth * 0.2, cardWidth],
    [4, 2, 0, 2, 4],
  );

  const opacity = useTransform(
    distance,
    [-cardWidth, -cardWidth * 0.2, 0, cardWidth * 0.2, cardWidth],
    [0, 0.8, 1, 0.8, 0],
  );

  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      key={card.id}
      style={{
        opacity,
        rotate,
        filter,
        minWidth: cardWidth,
      }}
      className="relative flex  flex-col justify-between rounded-[32px] border border-neutral-200 bg-white p-5 sm:h-auto sm:rounded-[40px] sm:p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex h-10 w-10 text-xl items-center justify-center rounded-2xl bg-neutral-100 font-doto font-bold dark:bg-neutral-800">
          {card.id}
        </div>

        <div className="flex flex-col gap-1.5">

          <h2 className="text-md font-poppins text-neutral-900 dark:text-neutral-100">
            {card.question}
          </h2>
        </div>
      </div>
      <FloatingPopover trigger={<p className="p-3 text-center">Show Answer</p>}>
          <h2 className="text-md bg-primary p-3 font-poppins text-neutral-900 dark:text-neutral-100">
            {card.answer}
          </h2>
      </FloatingPopover>
    </motion.div>
  );
};

export function WigglingCards({ cards }: { cards?: CardData[] }) {
  const data = cards || [];
  const [index, setIndex] = useState(1);
  const [dimensions, setDimensions] = useState({ cardWidth: 320, gap: 200 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({
          cardWidth: Math.min(width - 64, 300),
          gap: 40,
        });
      } else {
        setDimensions({
          cardWidth: 320,
          gap: 200,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { cardWidth, gap } = dimensions;
  const x = useMotionValue(-(index * (cardWidth + gap)));

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setIndex((prev) => Math.min(prev + 1, data.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div style={{ width: cardWidth + 40 }} className="relative mt-2">
        <motion.div
          className="flex touch-pan-y"
          drag="x"
          dragConstraints={{
            left: -(data.length - 1) * (cardWidth + gap),
            right: 0,
          }}
          style={{
            x,
            gap: `${gap}px`,
            perspective: 1000,
          }}
          animate={{
            x: -(index * (cardWidth + gap)),
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 40,
          }}
          onDragEnd={handleDragEnd}
        >
          {data.map((card, i) => (
            <WigglingCard
              key={card.id}
              card={card}
              i={i}
              x={x}
              cardWidth={cardWidth}
              gap={gap}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-8 flex gap-3">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition-colors duration-200 ease-out ${i === index
                ? 'bg-neutral-500 dark:bg-neutral-400'
                : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
