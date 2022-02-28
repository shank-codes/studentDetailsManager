const fs = require("fs");

const studentDAO = require("../DAO/studentDAO");
const imageService = require("../services/imageService");


/**
 * @module Students API
 */

/**
 * <hr>
 * @typedef studentDetails - Incoming student details from request embeded in a  object.
 * @type {object}
 * @property {object} id - The id of the incoming/result student object.
 * @property {string} name - The name of the incoming/result student object.
 * @property {string} dob - The date of birth of the incoming/result student object.
 * @property {string} studentNumber - The studentNumber of the incoming/result student object.
 * @property {string} gender - The gender of the incoming/result student object.
 * @property {object} image - The image of the incoming/result student object.
 * @property {string} email - The email of the incoming/result student object.
 */


/**
 * <hr>
 * Add student details
 * @param {studentDetails}  studentDetails - Student details from the request embeded in a object
 * @param {object} imageId - Id of the image after saving to the database
 * @returns {object}  - result after saving student details to the database
 * <hr>
 */

exports.addStudent = async (studentDetails, imageId) => {
  try {

    let savedStudent = await studentDAO.addStudent({
      name: studentDetails.name,
      dob: studentDetails.dob,
      email: studentDetails.email,
      gender: studentDetails.gender,
      username: studentDetails.studentNumber,
      image: imageId,
    },studentDetails.password);
    return { success: true, student: savedStudent };
  } catch (err) {
    console.log(err);
    return { success: false, Error: err };
  }
};

/**
 * <hr>
 * View student details
 * @param {object}  searchQuery - Filters that need to be applied while retrieving the students
 * @returns {object}  - result after fetching students from the 
 * <hr>
 */
exports.getStudents = async (searchQuery) => {
  try {
    let filter = {}
    if (typeof searchQuery.search != "undefined") {
      filter["name"] = new RegExp("^" + searchQuery.search, "i");
    }
    let students = await studentDAO.getStudents(filter);
    return { success: true, students: students.students };
  } catch (err) {
    return { success: false, Error: err };
  }
};

/**
 * <hr>
 * Fetch student details
 * @param {object}  studentId - Id of the student that need to be fetched
 * @returns {object}  - result after fetching the student
 * <hr>
 */

exports.getStudentById = async (studentId) => {
  try {
    let student = await studentDAO.getStudentById(studentId);
    return { success: true, student: student.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};

/**
 * <hr>
 * Update student details
 * @param {object} studentId - Id of the student whose details need to be updated
 * @param {studentDetails}  studentDetails - Student details from the request embeded in a object
 * @param {object} imageId - Id of the image after saving to the database
 * @returns {object}  - result after saving student details to the database
 * <hr>
 */

exports.updateStudentAndImage = async (studentId, studentDetails,imageId) => {
  try {
    let updatedStudent = await studentDAO.updateStudent(
      studentId,
      {
        name: studentDetails.name,
        dob: studentDetails.dob,
        email:studentDetails.email,
        gender: studentDetails.gender,
        studentNumber: studentDetails.studentNumber,
        image: imageId
      }
    );
    return { success: true, student: updatedStudent.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};

/**
 * <hr>
 * Delete student details
 * @param {object}  studentId - Id of the student that need to be deleted
 * @returns {object}  - result after deleting the student
 * <hr>
 */

exports.deleteStudent = async (studentId) => {
  try {
    let student = await studentDAO.getStudentById(studentId);
    if (!student.success) {
      throw new Error("cannot get studen by id");
    }
    let deletedImage = await imageService.deleteImage(student.student.image);
    console.log(deletedImage)
    if (!deletedImage.success) {
      console.log('error here')
      throw new Error("cannot delete image");
    }
    console.log(deletedImage);

    let deletedStudent = await studentDAO.deleteStudent(studentId);
    if (!deletedStudent.success) throw new Error("cannot delete student");
    return { success: true, student: deletedStudent.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};

/**
 * <hr>
 * Update student details without image
 * @param {object} studentId - Id of the student whose details need to be updated
 * @param {studentDetails}  studentDetails - Student details from the request embeded in a object
 * @returns {object}  - result after updating student details to the database
 * <hr>
 */

exports.updateStudent = async (studentId, studentDetails) => {
  try {
    let updatedStudent = await studentDAO.updateStudent(
      studentId,
      studentDetails
    );
    return { success: true, student: updatedStudent.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};