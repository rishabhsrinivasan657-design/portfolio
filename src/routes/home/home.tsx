import { useEffect, useRef, useState } from 'react';
import { Footer } from '~/components/footer';
import { featuredProjects } from '~/data/profile';
import { About } from './about';
import { Analytics } from './analytics';
import { Contact } from './contact';
import { ExperienceSection } from './experience';
import { Intro } from './intro';
import { MoreWork } from './more-work';
import { ProjectSummary } from './project-summary';
import { Skills } from './skills';
import styles from './home.module.css';

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState<Element[]>([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);

  const intro = useRef<HTMLElement>(null);
  const experience = useRef<HTMLElement>(null);
  const projectOne = useRef<HTMLElement>(null);
  const projectTwo = useRef<HTMLElement>(null);
  const projectThree = useRef<HTMLElement>(null);
  const projectFour = useRef<HTMLElement>(null);
  const analytics = useRef<HTMLElement>(null);
  const skills = useRef<HTMLElement>(null);
  const about = useRef<HTMLElement>(null);
  const moreWork = useRef<HTMLElement>(null);
  const contact = useRef<HTMLElement>(null);

  const projectRefs = [projectOne, projectTwo, projectThree, projectFour];

  useEffect(() => {
    const sections = [
      intro,
      experience,
      projectOne,
      projectTwo,
      projectThree,
      projectFour,
      analytics,
      skills,
      about,
      moreWork,
      contact,
    ];

    // Sections reveal once and stay revealed — unobserving on intersect stops
    // the page re-animating as the visitor scrolls back up.
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const section = entry.target;
          observer.unobserve(section);
          setVisibleSections(previous =>
            previous.includes(section) ? previous : [...previous, section]
          );
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => setScrollIndicatorHidden(!entry.isIntersecting),
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      if (section.current) sectionObserver.observe(section.current);
    });

    if (intro.current) indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, []);

  const isVisible = (ref: React.RefObject<HTMLElement>) =>
    Boolean(ref.current && visibleSections.includes(ref.current));

  return (
    <div className={styles.home}>
      <Intro id="intro" sectionRef={intro} scrollIndicatorHidden={scrollIndicatorHidden} />

      <ExperienceSection
        id="experience"
        sectionRef={experience}
        visible={isVisible(experience)}
      />

      {featuredProjects.map((project, index) => (
        <ProjectSummary
          key={project.id}
          id={`project-${index + 1}`}
          sectionRef={projectRefs[index]}
          visible={isVisible(projectRefs[index])}
          index={index + 1}
          alternate={index % 2 === 1}
          project={project}
        />
      ))}

      <Analytics id="analytics" sectionRef={analytics} visible={isVisible(analytics)} />

      <Skills id="skills" sectionRef={skills} visible={isVisible(skills)} />

      <About id="about" sectionRef={about} visible={isVisible(about)} />

      <MoreWork id="more-work" sectionRef={moreWork} visible={isVisible(moreWork)} />

      <Contact id="contact" sectionRef={contact} visible={isVisible(contact)} />

      <Footer />
    </div>
  );
};
