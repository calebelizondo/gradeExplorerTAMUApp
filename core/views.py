from django.shortcuts import render
from django.http import JsonResponse

from core.models import Section_grades
from django.views.decorators.csrf import csrf_exempt


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

    rep = {
        'subject_codes': Section_grades.objects.values('subject_code').distinct()
    }

    # Convert the subject_data list to JSON
    return JsonResponse(rep, safe=False)

#given list of answers, calculate score
def get_eval_score(responses):
    total_responses = sum(responses)
    score = 0
    for i in range(len(responses)):
        score += i * (responses[i] / total_responses)
    return score


#returns a professor's evaluation scores given a name, subject code and course number
def get_evals(request, subject_code, course_code, prof_name):

    #spaces cannot be in urls, so each space in the name was replaced with a '+'
    prof_name = prof_name.replace("+", " ")

    sections = Section_grades.objects.filter(subject_code=subject_code, course_code=course_code, professor_name=prof_name)

    a_1 = [0, 0, 0]
    a_2 = [0, 0, 0, 0]
    a_3 = [0, 0, 0, 0]
    a_4 = [0, 0, 0, 0]
    a_5 = [0, 0, 0, 0, 0, 0]
    a_6 = [0, 0, 0, 0, 0, 0]

    for section in sections:
        for i in range(len(section.answers_one)): 
            a_1[i] += section.answers_one[i]
        for i in range(len(section.answers_two)): 
            a_2[i] += section.answers_two[i]
        for i in range(len(section.answers_three)): 
            a_3[i] += section.answers_three[i]
        for i in range(len(section.answers_four)): 
            a_4[i] += section.answers_four[i]
        for i in range(len(section.answers_five)): 
            a_5[i] += section.answers_five[i]
        for i in range(len(section.answers_six)): 
            a_6[i] += section.answers_six[i]

    question_scores = [get_eval_score(a_1), get_eval_score(a_2), get_eval_score(a_3), get_eval_score(a_4), get_eval_score(a_5), get_eval_score(a_6)]

    eval_answers = {
        'name' : prof_name, 
        'question_scores' : question_scores,
        'eval_answers' : [a_1, a_2, a_3, a_4, a_5, a_6]
    }

    return JsonResponse(eval_answers, safe=False)
