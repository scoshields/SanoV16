import { SESSION_SECTIONS, ASSESSMENT_SECTIONS } from './responseProcessor/constants';
import type { NoteSection } from '../types';

export function parseSections(content: string, isAssessment: boolean): NoteSection[] {
  const sections = isAssessment ? ASSESSMENT_SECTIONS : SESSION_SECTIONS;
  const result: NoteSection[] = [];

  sections.forEach((heading, index) => {
    const nextHeading = sections[index + 1];
    const startRegex = new RegExp(`${heading}:\\s*`);
    const endRegex = nextHeading 
      ? new RegExp(`${nextHeading}:`) 
      : new RegExp('$');

    const startMatch = content.match(startRegex);
    if (startMatch) {
      const startIndex = startMatch.index! + startMatch[0].length;
      const endMatch = content.slice(startIndex).match(endRegex);
      const endIndex = endMatch 
        ? startIndex + endMatch.index! 
        : content.length;

      const sectionContent = content
        .slice(startIndex, endIndex)
        .trim();

      if (sectionContent) {
        result.push({
          id: heading.toLowerCase().replace(/\s+/g, '_'),
          heading,
          content: sectionContent,
          isProcessing: false
        });
      }
    }
  });

  return result;
}