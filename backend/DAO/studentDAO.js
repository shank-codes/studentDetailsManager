const studentModel = require("../models/studentModel");

exports.addStudent = async (studentDetails) => {
  try {
    let newStudent = new studentModel(studentDetails);
    const savedStudent = await newStudent.save();
    return { success: true, student: savedStudent };
  } catch (err) {
    console.log(err);
    return { success: false, Error: err };
  }
};

exports.getStudents = async () => {
  try {
    let students = await studentModel.find();
    return { success: true, students: students };
  } catch (err) {
    return { success: false, Error: err };
  }
};

exports.getStudentById = async (studentId) => {
  try {
    let student = await studentModel.findById(studentId);
    return { success: true, student: student };
  } catch (err) {
    return { success: false, Error: err };
  }
};

exports.updateStudent = async (studentId, studentDetails) => {
  try {
    let updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      studentDetails
    );
    return { success: true, student: updatedStudent };
  } catch (err) {
    return { success: false, Error: err };
  }
};

exports.deleteStudent = async (studentId) => {
  try {
    let deletedStudent = await studentModel.findByIdAndDelete(studentId);
    return { success: true, student: deletedStudent };
  } catch (err) {
    return { success: false, Error: err };
  }
};
