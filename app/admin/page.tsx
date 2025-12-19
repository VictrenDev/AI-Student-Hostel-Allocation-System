"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  User,
  Mail,
  Calendar,
  BookOpen,
  Moon,
  Volume2,
  Users as UsersIcon,
  Target,
  FileText,
  Brain,
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Book,
  TrendingUp,
  Dumbbell,
  Music,
  Coffee,
  Clock,
  Sun,
} from "lucide-react";

type QuestionnaireResponse = {
  questionId: string;
  answer: string | number | boolean;
};

type StudentWithDetails = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  gender: string;
  level: string;
  matricNo: string;
  createdAt: string;
  questionnaire?: QuestionnaireResponse[] | string | null;
  questionnaireSubmittedAt?: string | null;
  aiChronotype?: number | null;
  aiNoiseSensitivity?: number | null;
  aiSociability?: number | null;
  aiStudyFocus?: number | null;
  aiGeneratedAt?: string | null;
  hasQuestionnaire: boolean;
  hasAITraits: boolean;
};

type TraitScore = {
  name: string;
  value: number;
  color: string;
  description: string;
};

type SectionSummary = {
  section: string;
  count: number;
};

export default function UsersPreview() {
  const [users, setUsers] = useState<StudentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/get-students");

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load data");
      }

      console.log("📊 API Response:", data);

      // Process the users
      const enhancedUsers = data.users.map((user: any) => {
        let questionnaire = user.questionnaire;

        // Parse questionnaire if it's a string
        if (questionnaire && typeof questionnaire === "string") {
          try {
            questionnaire = JSON.parse(questionnaire);
          } catch (e) {
            console.warn(`Failed to parse questionnaire for ${user.name}:`, e);
            questionnaire = null;
          }
        }

        return {
          ...user,
          questionnaire,
          hasQuestionnaire: !!questionnaire,
          hasAITraits: !!user.aiChronotype,
        };
      });

      setUsers(enhancedUsers);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getTraitScores = (user: StudentWithDetails): TraitScore[] => [
    {
      name: "Chronotype",
      value: user.aiChronotype || 0,
      color: "bg-blue-500",
      description: "1 = Morning person, 7 = Night owl",
    },
    {
      name: "Noise Sensitivity",
      value: user.aiNoiseSensitivity || 0,
      color: "bg-red-500",
      description: "1 = Low sensitivity, 7 = High sensitivity",
    },
    {
      name: "Sociability",
      value: user.aiSociability || 0,
      color: "bg-green-500",
      description: "1 = Introvert, 7 = Extrovert",
    },
    {
      name: "Study Focus",
      value: user.aiStudyFocus || 0,
      color: "bg-purple-500",
      description: "1 = Light focus, 7 = Deep focus",
    },
  ];

  const getQuestionnaireSummary = (questionnaire: any): SectionSummary[] => {
    if (!questionnaire) return [];

    let responsesArray: any[] = [];

    // Handle all possible formats
    if (Array.isArray(questionnaire)) {
      responsesArray = questionnaire;
    } else if (typeof questionnaire === "string") {
      try {
        responsesArray = JSON.parse(questionnaire);
      } catch (error) {
        console.error("Failed to parse questionnaire string:", error);
        return [];
      }
    } else if (typeof questionnaire === "object") {
      // Might already be an object/array
      responsesArray = Array.isArray(questionnaire)
        ? questionnaire
        : [questionnaire];
    } else {
      console.warn("Unexpected questionnaire type:", typeof questionnaire);
      return [];
    }

    // Now process the array
    const sections: Record<string, any> = {};

    responsesArray.forEach((response: any) => {
      if (!response || typeof response !== "object") return;

      const questionId = response.questionId;
      if (typeof questionId !== "string") return;

      const parts = questionId.split(".");
      if (parts.length >= 2) {
        const section = parts[0];
        if (!sections[section]) {
          sections[section] = [];
        }
        sections[section].push(response);
      }
    });

    return Object.entries(sections).map(([section, items]) => ({
      section,
      count: items.length,
    }));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matricNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "withQuestionnaire" && user.hasQuestionnaire) ||
      (filter === "withTraits" && user.hasAITraits);

    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (userId: number) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Gender",
      "Level",
      "Matric No",
      "Questionnaire",
      "AI Traits",
      "Registered",
    ];
    const csvData = users.map((user) => [
      user.name,
      user.email,
      user.gender,
      user.level,
      user.matricNo,
      user.hasQuestionnaire ? "Yes" : "No",
      user.hasAITraits ? "Yes" : "No",
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students-data.csv";
    a.click();
  };

  const getAnswerDisplay = (answer: any): string => {
    if (typeof answer === "boolean") {
      return answer ? "Yes" : "No";
    }
    return String(answer || "");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchUsers}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => window.open("/api/test-populate", "_blank")}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Test Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading student data...</p>
          <p className="text-gray-500 text-sm mt-2">
            Fetching from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Student Management Dashboard
          </h1>
          <p className="text-gray-600">
            View all registered students, their questionnaire responses, and
            AI-generated personality traits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">
                  {users.length}
                </p>
              </div>
              <UsersIcon className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">With Questionnaire</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter((u) => u.hasQuestionnaire).length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">With AI Traits</p>
                <p className="text-3xl font-bold text-purple-600">
                  {users.filter((u) => u.hasAITraits).length}
                </p>
              </div>
              <Brain className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {users.filter((u) => !u.hasQuestionnaire).length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or matric number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Students</option>
                <option value="withQuestionnaire">With Questionnaire</option>
                <option value="withTraits">With AI Traits</option>
              </select>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Student Cards */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No students found matching your criteria
            </p>
            {searchTerm && (
              <p className="text-gray-400 mt-2">
                Try changing your search term or filter
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUsers.map((user) => {
              const traitScores = getTraitScores(user);
              const questionnaireSummary = getQuestionnaireSummary(
                user.questionnaire,
              );
              const isExpanded = expandedUserId === user.id;

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* Student Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(user.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {user.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {user.gender} • {user.level}
                            </span>
                            <span>Matric: {user.matricNo}</span>
                            <span className="text-xs text-gray-500">
                              Joined:{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {user.hasQuestionnaire && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Questionnaire
                              </span>
                            )}
                            {user.hasAITraits && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                <Brain className="w-4 h-4" />
                                AI Analyzed
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            Click to {isExpanded ? "collapse" : "expand"}{" "}
                            details
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* AI Traits Section */}
                        {user.hasAITraits && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Brain className="w-5 h-5 text-purple-500" />
                              AI-Generated Personality Traits
                              {user.aiGeneratedAt && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                  Generated:{" "}
                                  {new Date(
                                    user.aiGeneratedAt,
                                  ).toLocaleString()}
                                </span>
                              )}
                            </h4>
                            <div className="space-y-4">
                              {traitScores.map((trait, index) => (
                                <div key={index}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-700">
                                      {trait.name}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800">
                                      {trait.value}/7
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className={`h-2.5 rounded-full ${trait.color}`}
                                      style={{
                                        width: `${(trait.value / 7) * 100}%`,
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {trait.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Questionnaire Section */}
                        {user.hasQuestionnaire && user.questionnaire && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-green-500" />
                              Questionnaire Responses
                              {user.questionnaireSubmittedAt && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                  Submitted:{" "}
                                  {new Date(
                                    user.questionnaireSubmittedAt,
                                  ).toLocaleString()}
                                </span>
                              )}
                            </h4>

                            {questionnaireSummary.length > 0 && (
                              <div className="mb-6">
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Sections Completed:
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {questionnaireSummary.map((section, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                      {section.section}: {section.count}{" "}
                                      questions
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <h5 className="font-medium text-gray-700 mb-2">
                              Sample Responses:
                            </h5>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                              {(Array.isArray(user.questionnaire)
                                ? user.questionnaire
                                : []
                              )
                                .filter(
                                  (r: QuestionnaireResponse) =>
                                    !r.questionId.includes(".hobbies.") &&
                                    !r.questionId.includes(".hobbies.hobbies."),
                                )
                                .slice(0, 8)
                                .map(
                                  (
                                    response: QuestionnaireResponse,
                                    idx: number,
                                  ) => {
                                    const questionParts =
                                      response.questionId.split(".");
                                    const questionName =
                                      questionParts[questionParts.length - 1];

                                    return (
                                      <div
                                        key={idx}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                      >
                                        <div className="text-sm font-medium text-gray-800 mb-1 flex items-center gap-2">
                                          {questionName === "sleepSchedule" && (
                                            <Sun className="w-4 h-4" />
                                          )}
                                          {questionName === "studyHours" && (
                                            <BookOpen className="w-4 h-4" />
                                          )}
                                          {questionName ===
                                            "personalityType" && (
                                            <User className="w-4 h-4" />
                                          )}
                                          {questionName ===
                                            "noiseTolerance" && (
                                            <Volume2 className="w-4 h-4" />
                                          )}
                                          {questionName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {getAnswerDisplay(response.answer)}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                          Section: {questionParts[0]}
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                            </div>

                            {Array.isArray(user.questionnaire) &&
                              user.questionnaire.length > 8 && (
                                <p className="text-sm text-gray-500 mt-2">
                                  +{user.questionnaire.length - 8} more
                                  responses
                                </p>
                              )}
                          </div>
                        )}

                        {/* No Data Sections */}
                        {!user.hasQuestionnaire && !user.hasAITraits && (
                          <div className="col-span-2 text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">
                              This student hasn't completed the questionnaire
                              yet.
                            </p>
                            <p className="text-gray-400 text-sm">
                              No AI traits available without questionnaire data.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => window.open(`mailto:${user.email}`)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Email Student
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Send Reminder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Showing {filteredUsers.length} of {users.length} students
          {searchTerm && ` • Filtered by: "${searchTerm}"`}
          {filter !== "all" && ` • Filter: ${filter}`}
          {filteredUsers.length === 0 && users.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
