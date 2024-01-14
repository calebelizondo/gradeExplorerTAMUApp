import csv
from django.core.management.base import BaseCommand
from core.models import Section_grades  

class Command(BaseCommand):
    help = 'Import sections from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file = options['csv_file']

        with open(csv_file, 'r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                section = Section_grades(
                    semester=row['semester'],
                    year=row['year'],
                    subject_code = row['subject_code'], 
                    course_code=row['course_number'],
                    section_code=row['section_number'],
                    professor_name=row['professor_name'],
                    a_count=row['a'],
                    b_count=row['b'],
                    c_count=row['c'],
                    d_count=row['d'],
                    f_count=row['f'],
                    q_count=row['q'],
                    i_count=row['i'],
                    s_count=row['s'],
                    u_count=row['u'],
                    x_count=row['x'],

                    answers_one=[row['expected_1'], row['expected_2'], row['expected_3']], 
                    answers_two=[row['objectives_1'], row['objectives_2'], row['objectives_3'], row['objectives_4']], 
                    answers_three=[row['critical_thinking_1'], row['critical_thinking_2'], row['critical_thinking_3'], row['critical_thinking_4']], 
                    answers_four=[row['organization_1'], row['organization_2'], row['organization_3'], row['organization_4']], 
                    answers_five=[row['diverse_0'], row['diverse_1'], row['diverse_3'], row['diverse_4'], row['diverse_5']], 
                    answers_six=[row['feedback_1'], row['feedback_2'], row['feedback_3'], row['feedback_4'], row['feedback_5'], row['feedback_6']]


                )
                section.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully imported section: {section}'))

