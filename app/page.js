'use client';

import Hero from '@/components/Blocks/Hero/Hero';
import SkillSet from '@/components/Blocks/SkillSet/SkillSet';
import AiWorkflowTeaser from '@/components/Blocks/AiWorkflowTeaser/AiWorkflowTeaser';
import SelectedWorks from '@/components/Blocks/SelectedWorks/SelectedWorks';
import ExperienceBlock from '@/components/Blocks/Experience/Experience';
import Resume from '@/components/Blocks/Resume/Resume';
import Contact from '@/components/Blocks/Contact/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <SkillSet />
      <SelectedWorks />
      <ExperienceBlock />
      <AiWorkflowTeaser />
      <Resume />
      <Contact />
    </>
  );
}
