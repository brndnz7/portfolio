"use client";

import React from "react";

import Hero from '@/components/Blocks/Hero/Hero';
import About from '@/components/Blocks/About/About';
import SkillSet from "@/components/Blocks/SkillSet/SkillSet";
import SelectedWorks from '@/components/Blocks/SelectedWorks/SelectedWorks';
import ExperienceBlock from "@/components/Blocks/Experience/Experience";
import BlogPosts from "@/components/Blocks/BlogPosts/BlogPosts";
import CodepenShowcase from "@/components/Blocks/CodepenShowcase/CodepenShowcase";
import Resume from "@/components/Blocks/Resume/Resume";
import Gallery from "@/components/Blocks/Gallery/Gallery";

import BoldTitle from "@/components/UI/Cards/BoldTitle/BoldTitle";

export default function Home() {
  return (
    <>
      {/* Intro */}
      <Hero/>


      {/* Compétences */}
      <SkillSet/>

      {/* Réalisations sélectionnées */}
      <SelectedWorks/>

      {/* Expérience */}
      <ExperienceBlock/>




      {/* CV / Resume */}
      <Resume/>

    </>
  );
}
