const studentModel = require("../models/studentModel");

exports.addStudent = async (studentDetails,password) => {
  try {
    let newStudent = new studentModel(studentDetails);
    let savedStudent = await studentModel.register(newStudent,password)
    //const savedStudent = await newStudent.save();
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
    // this must be done when passport-local-mongoose is used
    if (studentDetails.password) {
      let student = await studentModel.findById(studentId);
      await student.setPassword(studentDetails.password, () => {
        student.save();
      });
    }
    let updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      {$set: studentDetails},
      {new : true}
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
