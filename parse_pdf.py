import pdfplumber
import csv

def parse_pdf(pdf_path, output_file):
    with pdfplumber.open(pdf_path) as pdf:
        # Extract text from each page
        text = ''
        for page in pdf.pages:
            text += page.extract_text()

    # Split the text into lines
    lines = text.split('\n')

    # Parse the lines and extract student data
    student_data = []
    current_student = {}
    for line in lines:
        line = line.strip()
        if line.isdigit():
            # New student data starts
            if current_student:
                student_data.append(current_student)
            current_student = {'sr_no': line}
        elif 'Roll No.' in line:
            roll_no = line.split(':')[1].strip()
            current_student['roll_no'] = roll_no
        elif line.startswith('Name'):
            name = line.split(':')[1].strip()
            current_student['name'] = name
        elif line.endswith('Papers Failed'):
            failed_courses = line.split(':')[1].strip()
            current_student['failed_courses'] = failed_courses.split(',')
        elif line.endswith('TC'):
            sgpa = line.split(':')[-2].strip()
            current_student['sgpa'] = float(sgpa)

    # Add the last student data
    if current_student:
        student_data.append(current_student)

    # Write student data to a CSV file
    with open(output_file, 'w', newline='') as csvfile:
        fieldnames = ['sr_no', 'roll_no', 'name', 'sgpa', 'failed_courses']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for student in student_data:
            writer.writerow(student)

# Example usage
pdf_path = 'result.pdf'
output_file = 'student_data.csv'
parse_pdf(pdf_path, output_file)