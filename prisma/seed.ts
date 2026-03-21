// Seed script for SmartLearn Dashboard
// Run: npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
// Or add to package.json prisma.seed and run: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find the first user to seed data for
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("No user found. Please register first, then run this seed script.");
    return;
  }

  console.log(`Seeding data for user: ${user.contact_name} (${user.email})`);

  // Seed Students
  const studentData = [
    { name: "Adebayo Olamide", email: "adebayo.o@school.edu", class_name: "SS 3A", avg_score: 88 },
    { name: "Chidinma Eze", email: "chidinma.e@school.edu", class_name: "SS 3A", avg_score: 92 },
    { name: "Emeka Nwosu", email: "emeka.n@school.edu", class_name: "SS 3B", avg_score: 74 },
    { name: "Fatima Bello", email: "fatima.b@school.edu", class_name: "SS 2A", avg_score: 81 },
    { name: "Gideon Ajayi", email: "gideon.a@school.edu", class_name: "SS 2A", avg_score: 67 },
    { name: "Halima Yusuf", email: "halima.y@school.edu", class_name: "SS 2B", avg_score: 95 },
    { name: "Ibrahim Musa", email: "ibrahim.m@school.edu", class_name: "JSS 3A", avg_score: 78 },
    { name: "Juliet Okafor", email: "juliet.o@school.edu", class_name: "JSS 3A", avg_score: 85 },
    { name: "Kemi Adeyemi", email: "kemi.a@school.edu", class_name: "JSS 2A", avg_score: 71 },
    { name: "Lateef Abdullahi", email: "lateef.a@school.edu", class_name: "JSS 2B", avg_score: 63 },
    { name: "Mary Johnson", email: "mary.j@school.edu", class_name: "JSS 1A", avg_score: 89 },
    { name: "Ngozi Obi", email: "ngozi.o@school.edu", class_name: "JSS 1A", avg_score: 76 },
  ];

  for (const s of studentData) {
    await prisma.student.create({
      data: { ...s, user_id: user.id },
    });
  }
  console.log(`  ✓ Created ${studentData.length} students`);

  // Seed Exams
  const examData = [
    { title: "Mathematics Final Exam", subject: "Mathematics", question_count: 50, duration: "2h 30m", status: "completed", student_count: 128, avg_score: 72 },
    { title: "English Language Mid-Term", subject: "English", question_count: 40, duration: "2h", status: "completed", student_count: 128, avg_score: 68 },
    { title: "Physics Practical Test", subject: "Physics", question_count: 25, duration: "1h 30m", status: "scheduled", scheduled_date: new Date("2026-03-25"), student_count: 64 },
    { title: "Chemistry Unit Test - Organic", subject: "Chemistry", question_count: 30, duration: "1h", status: "draft" },
    { title: "Biology SS2 Assessment", subject: "Biology", question_count: 35, duration: "1h 30m", status: "scheduled", scheduled_date: new Date("2026-03-28"), student_count: 96 },
    { title: "Civic Education Quiz", subject: "Civics", question_count: 20, duration: "45m", status: "completed", student_count: 192, avg_score: 81 },
    { title: "Computer Studies Test", subject: "ICT", question_count: 30, duration: "1h", status: "draft" },
  ];

  for (const e of examData) {
    await prisma.exam.create({
      data: { ...e, user_id: user.id },
    });
  }
  console.log(`  ✓ Created ${examData.length} exams`);

  // Seed Questions
  const questionData = [
    { subject: "Mathematics", topic: "Quadratic Equations", text: "Solve: x² + 5x + 6 = 0", options: JSON.stringify(["x=-2,-3", "x=2,3", "x=-1,-6", "x=1,6"]), answer: "x=-2,-3" },
    { subject: "Mathematics", topic: "Algebra", text: "Simplify: 3(2x + 4) - 2(x - 1)", options: JSON.stringify(["4x + 14", "4x + 10", "8x + 14", "4x + 12"]), answer: "4x + 14" },
    { subject: "Mathematics", topic: "Trigonometry", text: "What is sin(90°)?", options: JSON.stringify(["0", "1", "0.5", "undefined"]), answer: "1" },
    { subject: "English", topic: "Essay Writing", text: "Which of the following is the correct use of a semicolon?", options: JSON.stringify(["Before a list", "Between independent clauses", "After a dependent clause", "Before a conjunction"]), answer: "Between independent clauses" },
    { subject: "English", topic: "Grammar", text: "Identify the correct sentence:", options: JSON.stringify(["Me and him went", "He and I went", "Him and I went", "Me and he went"]), answer: "He and I went" },
    { subject: "Physics", topic: "Electromagnetic Waves", text: "What is the speed of light in vacuum?", options: JSON.stringify(["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"]), answer: "3×10⁸ m/s" },
    { subject: "Physics", topic: "Mechanics", text: "What is Newton's second law?", options: JSON.stringify(["F = ma", "F = mv", "F = mg", "F = mv²"]), answer: "F = ma" },
    { subject: "Chemistry", topic: "Organic Nomenclature", text: "What is the IUPAC name of CH₃CH₂OH?", options: JSON.stringify(["Methanol", "Ethanol", "Propanol", "Butanol"]), answer: "Ethanol" },
    { subject: "Chemistry", topic: "Periodic Table", text: "What is the atomic number of Carbon?", options: JSON.stringify(["4", "6", "8", "12"]), answer: "6" },
    { subject: "Biology", topic: "Cell Division", text: "How many chromosomes do human somatic cells have?", options: JSON.stringify(["23", "46", "44", "48"]), answer: "46" },
    { subject: "Biology", topic: "Genetics", text: "What does DNA stand for?", options: JSON.stringify(["Deoxyribonucleic Acid", "Dinitrogen Acid", "Deoxyribose Acid", "Dynamic Nucleic Acid"]), answer: "Deoxyribonucleic Acid" },
    { subject: "Civics", topic: "Government", text: "How many arms of government are there in Nigeria?", options: JSON.stringify(["2", "3", "4", "5"]), answer: "3" },
  ];

  for (const q of questionData) {
    await prisma.question.create({
      data: { ...q, user_id: user.id },
    });
  }
  console.log(`  ✓ Created ${questionData.length} questions`);

  console.log("\nSeeding complete! 🎉");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
