import React from "react";
import { Trophy, BookOpen, Question, Headphones, Target, Gear, List } from "@phosphor-icons/react";

const map = {
  trophy: Trophy,
  book: BookOpen,
  quiz: Question,
  headphones: Headphones,
  target: Target,
  gear: Gear,
  menu: List,
};

export default function IconGlyph({ name, size=26, weight="duotone" }) {
  const Cmp = map[name] ?? Trophy;
  return <Cmp size={size} weight={weight} />;
}

