from django.shortcuts import render
from django.http import JsonResponse

from core.models import Section_grades

def home(request):
    return render(request, 'home.html')

grading_system = {'a': 4.0, 'b': 3.0, 'c': 2.0, 'd': 1.0, 'f': 0.0}

def calculate_gpa(grade_counts):
    # Define your grading system here (e.g., A=4.0, B=3.0, etc.)

    total_points = 0
    total_students = 0

    for grade, count in grade_counts.items():
        total_points += grading_system.get(grade, 0) * count
        total_students += count

    if total_students == 0:
        return 0.0

    return total_points / total_students

def get_grades(request, subject_code, course_code):
    subject_code = subject_code.upper()
    course_code = course_code.upper()

    section_grades = Section_grades.objects.filter(subject_code=subject_code, course_code=course_code)

    professor_data = []

    # Group section grades by professor name
    professors = set(section_grade.professor_name for section_grade in section_grades)

    for professor in professors:
        professor_grades = section_grades.filter(professor_name=professor)
        print(professor_grades)

        # Calculate the grade distribution for the professor
        grade_distribution = {'a': 0, 'b': 0, 'c': 0, 'd': 0, 'f': 0}
        for section_grade in professor_grades:
            for grade in grading_system.keys():
                grade_distribution[grade] += getattr(section_grade, "{}_count".format(grade.lower()), 0)

        # Calculate the average GPA for the professor
        average_gpa = calculate_gpa(grade_distribution)

        professor_info = {
            'professor': professor,
            'average_gpa': average_gpa,
            'grade_distribution': grade_distribution
        }

        professor_data.append(professor_info)

    return JsonResponse(professor_data, safe=False)


def get_subject_codes(request):

    # Get all unique subject codes
    unique_subject_codes = Section_grades.objects.values('subject_code').distinct()

    # Create a dictionary to store subject codes and associated course numbers
    subject_data = []

    for subject in unique_subject_codes:
        subject_code = subject['subject_code']

        # Query the database to get unique course codes for the current subject code
        course_numbers = Section_grades.objects.filter(subject_code=subject_code).values_list('course_code', flat=True).distinct()
        course_numbers_list = list(course_numbers)

        # Create a dictionary for the current subject code and its course numbers
        subject_info = {
            'subject_code': subject_code,
            'course_numbers': course_numbers_list,
        }

        # Add the subject info to the subject_data list
        subject_data.append(subject_info)

    # Convert the subject_data list to JSON
    return JsonResponse(subject_data, safe=False)


def get_evals(request, subject_code, course_code, prof_name):
    sections = Section_grades.objects.filter(subject_code=subject_code, course_code=course_code, professor_name=prof_name)
    a_1 = [0, 0, 0]
    a_2 = [0, 0, 0, 0]
    a_3 = [0, 0, 0, 0]
    a_4 = [0, 0, 0, 0]
    a_5 = [0, 0, 0, 0, 0, 0]
    a_6 = [0, 0, 0, 0, 0, 0]
    for section in sections:
        for i in range(len(section.answers_one)): 
            a_1[i] += section.answers_1[i]
        for i in range(len(section.answers_two)): 
            a_2[i] += section.answers_2[i]
        for i in range(len(section.answers_three)): 
            a_3[i] += section.answers_3[i]
        for i in range(len(section.answers_four)): 
            a_4[i] += section.answers_4[i]
        for i in range(len(section.answers_five)): 
            a_5[i] += section.answers_5[i]
        for i in range(len(section.answers_six)): 
            a_6[i] += section.answers_6[i]

    eval_answers = {
        'name' : prof_name, 
        'eval_answers' : {a_1, a_2, a_3, a_4, a_5, a_6} 
    }

    return JsonResponse(eval_answers, safe=False)
