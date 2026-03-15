"use client";

import { Group, Rect, Text } from "react-konva";
import type { FurnitureItem as FurnitureItemType } from "@/types";

interface FurnitureItemProps {
  item: FurnitureItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (item: FurnitureItemType) => void;
}

export default function FurnitureItem({
  item,
  isSelected,
  onSelect,
  onChange,
}: FurnitureItemProps) {
  return (
    <Group
      id={item.id}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      rotation={item.rotation}
      draggable
      onClick={() => onSelect(item.id)}
      onTap={() => onSelect(item.id)}
      onDragEnd={(e) => {
        onChange({
          ...item,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
    >
      <Rect
        width={item.width}
        height={item.height}
        fill={item.color}
        opacity={0.85}
        cornerRadius={4}
        stroke={isSelected ? "#3B82F6" : "#ffffff"}
        strokeWidth={isSelected ? 2 : 1}
        shadowBlur={isSelected ? 8 : 2}
        shadowColor={isSelected ? "#3B82F6" : "rgba(0,0,0,0.2)"}
        shadowOpacity={0.5}
      />
      <Text
        text={item.emoji}
        fontSize={Math.min(item.width, item.height) * 0.4}
        x={0}
        y={0}
        width={item.width}
        height={item.height}
        align="center"
        verticalAlign="middle"
      />
      <Text
        text={item.label}
        fontSize={10}
        x={0}
        y={item.height - 14}
        width={item.width}
        align="center"
        fill="#ffffff"
        fontStyle="bold"
      />
    </Group>
  );
}
