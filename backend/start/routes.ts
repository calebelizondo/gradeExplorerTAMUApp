import router from '@adonisjs/core/services/router';
import axios from 'axios';
import Section from "#models/section";
import fs from 'fs';
import csv from 'csv-parser';


const scrape_url = "https://anex.us/grades/getData/";

const generateCourseNumbers = (): string[] => {
  const numbers = [];
  for (let i = 0; i < 1000; i++) {
    numbers.push(i.toString().padStart(3, '0'));
  }
  return numbers;
};

router.get('get_detailed_instructor', async (ctx: any) => {
  const { dept, number, name } = ctx.request.qs();

  if (!dept || !number || !name) {
    return ctx.response.internalServerError({
      message: 'missing an arg',
      dept,
      number,
    });
  }

  const sections: Section[] = await Section.query()
    .where('dept', dept)
    .andWhere('number', number)
    .andWhere('prof', name);

  if (sections.length === 0) {
    return ctx.response.notFound({
      message: 'No sections found for the given dept, number, and name',
    });
  }

  const result: Record<number, { a: number; b: number; c: number; d: number; f: number }> =
    sections.reduce((acc: Record<number, { a: number; b: number; c: number; d: number; f: number }>, section) => {
      const year = parseInt(section.year, 10);

      if (!acc[year]) {
        acc[year] = { a: 0, b: 0, c: 0, d: 0, f: 0 };
      }

      acc[year].a += section.a;
      acc[year].b += section.b;
      acc[year].c += section.c;
      acc[year].d += section.d;
      acc[year].f += section.f;

      return acc;
    }, {}); 

  ctx.response.ok(result);
});


router.get('get_instructors', async (ctx: any) => {
  const {dept, number} = ctx.request.qs();

  if (!dept || !number) {
    return ctx.response.internalServerError({ message: 'missing dept and number args',
      dept,
      number
     });
  }

  const sections = await Section.query().where('dept', dept).andWhere('number', number);

  if (sections.length === 0) {
    return ctx.response.notFound({ message: 'No sections found for the given dept and number' });
  }

  const instructorData = sections.reduce((acc: any, section) => {
    const { prof, a, b, c, d, f, q, gpa } = section;

    if (!acc[prof]) {
      acc[prof] = {
        name: prof,
        grades: [],
        totalGpa: 0,
        count: 0,
      };
    }

    acc[prof].grades.push({ a, b, c, d, f, q});
    acc[prof].totalGpa += parseFloat(gpa);
    acc[prof].count += 1;

    return acc;
  }, {});

  const result = Object.values(instructorData).map((instructor: any) => ({
    name: instructor.name,
    grades: instructor.grades,
    gpa: (instructor.totalGpa / instructor.count).toFixed(2), 
  }));

  return ctx.response.ok(result);
});


router.get('/get_codes', async (ctx: any) => {


  try {
    const sections = await Section.query().select('dept', 'number');


    const result = sections.reduce((acc: Record<string, Set<string>>, section) => {
      if (!acc[section.dept]) {
        acc[section.dept] = new Set();
      }
      acc[section.dept].add(section.number);
      return acc;
    }, {});

    const formattedResult = Object.fromEntries(
      Object.entries(result).map(([dept, numbers]) => [dept, Array.from(numbers)])
    );

    return ctx.response.ok(formattedResult);
  } catch (error) {
    console.error(error);
    return ctx.response.internalServerError({ message: 'An error occurred while fetching data.' });
  }
});

router.get('/scrape', async (ctx: any) => {
  const {start} = ctx.request.qs();
  const deptCodes = new Set<string>();

  // Step 1: Read and Parse the CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream('../sections.csv') 
      .pipe(csv())
      .on('data', (row) => {
        deptCodes.add(row.subject_code);
      })
      .on('end', () => {
        resolve(true);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
  const courseNumbers = generateCourseNumbers();
  const j : string[] = Array.from(deptCodes);
  if (start) j.splice(0, j.indexOf(start) - 1);

  const subjectCodes = j;
  let count = 0;


  try {
    for (const dept of subjectCodes) {
      console.log("DEPT", dept);
      console.log(`${count++} / ${subjectCodes.length}`);
      for (const number of courseNumbers) {
        try {
          
          const response = await axios.post(
            scrape_url,
            new URLSearchParams({ dept, number }).toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              },
            }
          );

          const classes = response.data.classes;

          for (const gradeData of classes) {

            const exists = await Section.query()
              .where('dept', gradeData.dept)
              .andWhere('number', gradeData.number)
              .andWhere('section', gradeData.section)
              .andWhere('year', gradeData.year)
              .andWhere('semester', gradeData.semester)
              .first();

            if (!exists) {

              await Section.create({
                dept: gradeData.dept,
                number: gradeData.number,
                section: gradeData.section,
                a: parseInt(gradeData.A),
                b: parseInt(gradeData.B),
                c: parseInt(gradeData.C),
                d: parseInt(gradeData.D),
                f: parseInt(gradeData.F),
                i: parseInt(gradeData.I),
                s: parseInt(gradeData.S),
                u: parseInt(gradeData.U),
                q: parseInt(gradeData.Q),
                x: parseInt(gradeData.X),
                prof: gradeData.prof,
                year: gradeData.year,
                semester: gradeData.semester,
                gpa: parseFloat(gradeData.gpa),
              });
            }
          }
        } catch (error) {
          if (error.message === "classes is not iterable") continue;
          else console.error(`Scraping failed: ${error.message}`);
          return ctx.response.status(500).json({
            message: 'An error occurred during scraping.',
          });
        }

      
      }
    }

    

    return ctx.response.status(200).json({
      message: 'Scraping completed successfully.',
    });
  } catch (error) {
    console.error(`Scraping failed: ${error.message}`);
    return ctx.response.status(500).json({
      message: 'An error occurred during scraping.',
    });
  }
});