from django.contrib.postgres.fields import ArrayField
from django.db import models

class Sample(models.Model):
    
    attachment = models.FileField()


class Section_grades(models.Model):
    SEMESTER_CHOICES = [
        ('SPRING', 'Spring'),
        ('SUMMER', 'Summer'),
        ('FALL', 'Fall'),
        ('WINTER', 'Winter'),
    ]
    #section information
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    year = models.PositiveIntegerField()
    subject_code = models.CharField(max_length=4)
    course_code = models.CharField(max_length=4)
    section_code = models.CharField(max_length=4)
    professor_name = models.CharField(max_length=100)

    #grades
    a_count = models.PositiveIntegerField()
    b_count = models.PositiveIntegerField()
    c_count = models.PositiveIntegerField()
    d_count = models.PositiveIntegerField()
    f_count = models.PositiveIntegerField()
    q_count = models.PositiveIntegerField()
    i_count = models.PositiveIntegerField()
    s_count = models.PositiveIntegerField()
    u_count = models.PositiveIntegerField()
    x_count = models.PositiveIntegerField()

    #course evaluation responses
    answers_one = ArrayField(
        models.IntegerField(),
        blank=True, 
        null=False, 
    )

    answers_two = ArrayField(
        models.IntegerField(),
        blank=True, 
        null=False, 
    )

    answers_three = ArrayField(
        models.IntegerField(),
        blank=True, 
        null=False, 
    )

    answers_four = ArrayField(
        models.IntegerField(),
        blank=True, 
        null=False, 
    )

    answers_five = ArrayField(
        models.IntegerField(),
        blank=True, 
        null=False, 
    )

    answers_six = ArrayField(
        models.IntegerField(),
        blank=True, 
        null=False, 
    )

    def __str__(self):
        return f"{self.year} {self.semester} - {self.course_code} ({self.section_code})"