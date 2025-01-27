import { cn } from "@/lib/utils";
import { ReactNode, MouseEvent, RefObject } from "react";
import { ContactModal } from "./sections/contact-section";
import React from "react";
import { contactDataAtom, contactModalOpenAtom } from "@/lib/store/contact";
import { useAtom } from "jotai";
import {
  educationAtom,
  educationModalOpenAtom,
  experienceModalOpenAtom,
  experiencesAtom,
  skillsAtom,
  skillsModalOpenAtom,
} from "@/lib/store/resume";
import { ExperienceModal } from "./sections/experience-modal";
import { EducationModal } from "./sections/education-modal";
import { SkillsModal } from "./sections/skills-modal";

interface ResumeSectionProps {
  title?: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const ResumeSection = ({ title, children, onClick }: ResumeSectionProps) => (
  <section
    className="group p-6 bg-white shadow-sm transition-all
               hover:shadow-md hover:border-l-4 hover:border-blue-200
               cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-300"
    tabIndex={0}
    onClick={onClick}
  >
    <h2
      className={cn(
        "text-xl font-semibold mb-4 text-gray-800",
        !title && "hidden",
      )}
    >
      {title}
    </h2>
    <div className="text-gray-600 space-y-4">{children}</div>
  </section>
);

interface ExperienceItemProps {
  company: string;
  location: string;
  position: string;
  dates: string;
  children: ReactNode;
}

const ExperienceItem = ({
  company,
  location,
  position,
  dates,
  children,
}: ExperienceItemProps) => (
  <div className="mb-6">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-medium text-gray-900">
          {company} | {location}
        </h3>
        <p className="text-gray-700">{position}</p>
      </div>
      <span className="text-sm text-gray-500">{dates}</span>
    </div>
    <div className="text-gray-600 space-y-2">{children}</div>
  </div>
);

export const ResumeComponent = ({
  ref,
}: {
  ref?: RefObject<HTMLDivElement | null>;
}) => {
  const [contactData] = useAtom(contactDataAtom);
  const [experiences] = useAtom(experiencesAtom);
  const [education] = useAtom(educationAtom);
  const [skills] = useAtom(skillsAtom);

  const [, setContactModalOpen] = useAtom(contactModalOpenAtom);
  const [, setExperienceModalOpen] = useAtom(experienceModalOpenAtom);
  const [, setEducationModalOpen] = useAtom(educationModalOpenAtom);
  const [, setSkillsModalOpen] = useAtom(skillsModalOpenAtom);

  const contactInfo = [
    contactData.phone,
    contactData.email,
    contactData.location,
  ].filter(Boolean);

  return (
    <div ref={ref} className="max-w-3xl mx-auto my-8 p-8 bg-gray-50 rounded-xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {contactData.fullName}
        </h1>
        <ResumeSection onClick={() => setContactModalOpen(true)}>
          <div className="flex flex-wrap items-center gap-x-4 text-gray-600">
            {contactInfo.map((info, index) => (
              <React.Fragment key={index}>
                <span>{info}</span>
                {index < contactInfo.length - 1 && (
                  <span className="text-gray-400">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </ResumeSection>
      </header>

      <ResumeSection
        title="Experience"
        onClick={() => setExperienceModalOpen(true)}
      >
        {experiences.map((exp, index) => (
          <ExperienceItem
            key={index}
            company={exp.company}
            location={exp.location}
            position={exp.position}
            dates={exp.dates}
          >
            <ul className="list-disc pl-6 space-y-2">
              {exp.description.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </ExperienceItem>
        ))}
      </ResumeSection>

      <ResumeSection title="Skills" onClick={() => setSkillsModalOpen(true)}>
        <div className="flex flex-wrap gap-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection
        title="Education"
        onClick={() => setEducationModalOpen(true)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">
              {education.institution}
            </h3>
            <p className="text-gray-700">
              {education.degree} in {education.field}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">{education.location}</p>
            <p className="text-sm text-gray-500">{education.dates}</p>
          </div>
        </div>
      </ResumeSection>
      <ContactModal />
      <ExperienceModal />
      <EducationModal />
      <SkillsModal />
    </div>
  );
};
