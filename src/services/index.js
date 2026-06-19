import apiClient from "./apiClient";

// Admin Services
import * as admissionsService from "./admin/admissionsService";
import * as complaintsService from "./admin/complaintsService";
import * as feesService from "./admin/feesService";
import * as idCardsService from "./admin/idCardsService";
import * as messagesService from "./admin/messagesService";
import * as subjectsService from "./admin/subjectsService";
import * as syllabusService from "./admin/syllabusService";
import * as tasksService from "./admin/tasksService";
import * as teachersService from "./admin/teachersService";

// Teacher Services
import * as teacherAssignmentsService from "./teacher/assignmentService";
import * as teacherChatService from "./teacher/chatService";
import * as teacherSubmissionsService from "./teacher/submissionService";
import * as teacherTasksService from "./teacher/taskService";

// ✅ Student Services
import * as studentAssignmentService from "./student/assignmentService";
import * as studentIdCardService from "./student/idCardService";
import * as studentStatsService from "./student/statsService";
import * as studentSubmissionService from "./student/submissionService";

export {
  apiClient,
  // Admin
  admissionsService,
  complaintsService,
  feesService,
  idCardsService,
  messagesService,
  subjectsService,
  syllabusService,
  tasksService,
  teachersService,
  // Teacher
  teacherAssignmentsService,
  teacherChatService,
  teacherSubmissionsService,
  teacherTasksService,
  // Student
  studentAssignmentService,
  studentIdCardService,
  studentStatsService,
  studentSubmissionService,
};

export default {
  apiClient,
  admissionsService,
  complaintsService,
  feesService,
  idCardsService,
  messagesService,
  subjectsService,
  syllabusService,
  tasksService,
  teachersService,
  teacherAssignmentsService,
  teacherChatService,
  teacherSubmissionsService,
  teacherTasksService,
  studentAssignmentService,
  studentIdCardService,
  studentStatsService,
  studentSubmissionService,
};