import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does ANDL enhance my learning experience?",
      answer:
        "ANDL connects directly to your LMS (like Brightspace or Canvas) to understand your syllabus, deadlines, and course materials. It then builds a personalized, interactive study plan that helps you focus on exactly what you need to learn, when you need to learn it.",
    },
    {
      question: "What makes ANDL different from other AI tutoring platforms?",
      answer:
        "Most tools give you generic answers or isolated features like flashcards. ANDL is different—it's an end-to-end learning companion that adapts to your pace, goals, and gaps. It builds a cohesive study strategy rather than throwing disconnected tools at you.",
    },
    {
      question: "Can ANDL help me stay on top of deadlines and exams?",
      answer:
        "Yes. ANDL automatically ingests your academic calendar and syllabus, and then generates a dynamic study schedule that adjusts based on your progress. It ensures you’re always prepared for assignments, exams, and everything in between.",
    },
    {
      question: "Who is ANDL for?",
      answer:
        "ANDL is built for students, but designed to scale—from individual learners who want a smarter study system, to universities looking to provide adaptive, AI-powered support at scale. We offer both personal and institutional plans, including private hosting options.",
    },
  ];

  return (
    <section
      id="faq"
      className="px-4 py-16 bg-[#f9f9f9] dark:bg-[#1F2937] text-[#00171f] dark:text-[#F9FAFB] relative -z-10"
    >
      <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-xl font-semibold dark:text-[#F9FAFB]">
                {faq.question}
              </h3>
              <button className="text-[#977cce] dark:text-[#977cce] transition-transform duration-500 transform">
                {openFAQ === index ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
            <div
              className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
                openFAQ === index ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-600 dark:text-[#e1e1e1] pb-4">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
