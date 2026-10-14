<?php

namespace App\Http\Controllers;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use App\Models\QuizResult;
use Illuminate\Http\Request;

class quizController extends Controller
{
    //Quiz
    public function createQuiz(Request $request)
    {
        $request->validate([
            'course_id'     => 'required|exists:courses,id',   // Hangi kursa ait?
            'title'         => 'required|string|max:255',      // Sınav Başlığı
            'description'   => 'nullable|string',              // Açıklama
            'time_limit'    => 'nullable|integer|min:1',       // Dakika cinsinden süre
            'passing_score' => 'required|integer|min:0|max:100', // Geçme notu (0-100 arası)
        ]);
        $quiz= Quiz::create([
            'course_id'     => $request->course_id,
            'title'         => $request->title,
            'description'   => $request->description,
            'time_limit'    => $request->time_limit,
            'passing_score' => $request->passing_score,
        ]);
        return response()->json (['message' => 'Quiz created successfully','quiz'=>$quiz], 201);
    }

    public function updateQuiz(Request $request, $id)
    {
        $quiz = Quiz::findOrFail($id);
        $newQuiz=$request->validate([
            'title'         => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|nullable|string',
            'time_limit'    => 'sometimes|nullable|integer|min:1',
            'passing_score' => 'sometimes|required|integer|min:0|max:100',
        ]);
        $quiz->update($newQuiz);
        return response()->json(['message' => 'Quiz updated successfully', 'quiz' => $quiz], 200);
    }
    
    public function deleteQuiz($id)
    {
        $quiz = Quiz::findOrFail($id);
        $quiz->delete();
        return response()->json(['message' => 'Quiz deleted successfully'], 200);
    }
    //Question and Options
    public function addQuestion(Request $request)
    {
        $request->validate([
            'quizId'        => 'required|exists:quizzes,id',
            'question_text' => 'required|string',
            'options'       => 'required|array|min:2',
            'correct_option'=> 'required|integer|min:0',
            'points'        => 'required|integer|min:1', 
        ]);
        $question = Question::create([
            'quiz_id'       => $request->quizId,
            'question_text' => $request->question_text,
            'points'        => $request->points, 
        ]);

        foreach ($request->options as $index => $optionText) {
            Option::create([
                'question_id' => $question->id,
                'option_text' => $optionText,
                'is_correct'  => ($index == $request->correct_option),
            ]);
        }
        return response()->json([
            'message'  => 'Question added successfully', 
            'question' => $question->load('options')
        ], 201);
    }
    public function updateQuestion(Request $request, $id)
    {
    $question = Question::findOrFail($id);
    
    $request->validate([
        'question_text'  => 'required|string',
        'options'        => 'required|array|min:2',
        'correct_option' => 'required|integer|min:0',
        'points'         => 'required|integer|min:1', 
    ]);
    
    $question->update([
        'question_text' => $request->question_text,
        'points'        => $request->points,
    ]);
    
    $question->options()->delete(); 

    foreach ($request->options as $index => $optionText) {
        $question->options()->create([
            'option_text' => $optionText,
            'is_correct'  => ($index == $request->correct_option),
        ]);
    }

    return response()->json([
        'message'  => 'Question and points updated successfully', 
        'question' => $question->load('options')
    ], 200);
    }
    public function deleteQuestion($id)
    {
        $question = Question::findOrFail($id);
        $question->delete();
        return response()->json(['message' => 'Question deleted successfully'], 200);
    }

    public function indexQuizzesByCourse($course_id)
    {
        $quizzes = Quiz::where('course_id', $course_id)->with('questions.options')->get();
        return response()->json(['quizzes' => $quizzes], 200);
    }
}
