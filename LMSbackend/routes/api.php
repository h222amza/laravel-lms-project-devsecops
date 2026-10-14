<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\createAccountController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\lessonController;
use App\Http\Controllers\quizController;
use App\Http\Controllers\settingController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderManagementOrderController;
use App\Http\Controllers\dashboardController;
use App\Http\Controllers\WatchedLessonController;
use App\Http\Controllers\favoriteController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CoursesController;

Route::middleware('throttle:api')->group(
    function () {
        //login routes
        Route::middleware('throttle:login')->group(function () {
            Route::post('/login', [AuthController::class, 'loginUser']);
            Route::post('/admin/login', [AuthController::class, 'loginAdmin']);
        });
        Route::post('/register', [createAccountController::class, 'createUser']);

        //site settings
        Route::get('/settings', [settingController::class, 'index'])->name('getSettings');
        // Courses listing for guests

        //
        Route::get('/courses/popular', [CoursesController::class, 'getPopularCourses']);
        Route::get('/courses/new', [CoursesController::class, 'getNewCourses']);
        // main dashboard (category and courses) + search
        Route::get('/categories', [CategoryController::class, 'indexForGuests'])->name('listCategoriesForGuests');
        Route::get('/category/{id}', [CategoryController::class, 'show'])->name('showCategory');

        Route::get('/courses', [CoursesController::class, 'index'])->name('listCoursesForGuests');
        Route::get('/course/{id}', [CoursesController::class, 'showForGuests'])->name('showCourseForGuests');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', action: [AuthController::class, 'logout']);

            //*****************************SuperAdmin routes****************************
            Route::middleware(['role:superAdmin'])->prefix('superadmin')->name('superadmin.')->group(function () {
                Route::post('/create-superadmin', [createAccountController::class, 'createSuperAdmin']);

                Route::post('/create-admin', [createAccountController::class, 'createAdmin']);
                Route::get('/show-admins', [AdminController::class, 'showAdmins'])->name('showAdmins');
                Route::delete('delete-admins/{id}', [AdminController::class, 'deleteAdmins'])->name('deleteAdmins');
                //category routes
                Route::post('/create-category', [CategoryController::class, 'create'])->name('createCategory');
                Route::post('/update-category/{id}', [CategoryController::class, 'update'])->name('updateCategory');
                Route::get('/categories', [CategoryController::class, 'index'])->name('listCategories');
                Route::delete('/category/{id}', [CategoryController::class, 'delete'])->name('deleteCategory');
                // Approve course
                Route::get('/courses', [AdminController::class, 'index'])->name('listCoursesForGuests');
                Route::post('/approve-course/{id}', [AdminController::class, 'isProvided'])->name('approveCourse');
                // site settings
                Route::get( '/settings', [settingController::class, 'index'])->name('getSettings');
                Route::post('/update-setting', [settingController::class, 'update'])->name('updateSetting');
                Route::delete('/setting/{id}', [settingController::class, 'delete'])->name('deleteSetting');
                //Orders management
                Route::get('/all-orders', [OrderManagementOrderController::class, 'allOrders'])->name('allOrders');
                Route::get('/order-details/{id}', [OrderManagementOrderController::class, 'showAdminOrderDetails'])->name('showAdminOrderDetails');
                Route::get('/getSalesAnalytics', [dashboardController::class, 'getSalesAnalytics'])->name('getSalesAnalytics');
                //Messages Management
                Route::get('/conversations', [ChatController::class, 'getAllConversationsAdmin']);
                Route::get('/conversations/{id}', [ChatController::class, 'viewConversationAdmin']);
                Route::delete('/conversations/{id}', [ChatController::class, 'deleteConversationAdmin']);
            });
            //*****************************Admin routes****************************
            Route::middleware(['role:admin,superAdmin'])->prefix('admin')->name('admin.')->group(function () {
                Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
                //course routes
                Route::get("/getCategory", [AdminController::class, "getCategory"])->name("getCategory");
                Route::post('/create-course', [CoursesController::class, 'create'])->name('createCourse');
                Route::get('/courses', [CoursesController::class, 'index'])->name('listCourses');
                Route::get('/my-courses', [CoursesController::class, 'myCourses'])->name('myCourses');
                Route::get('/course/{id}', [CoursesController::class, 'show'])->name('showCourse');
                Route::post('/update-course/{id}', [CoursesController::class, 'update'])->name('updateCourse');
                Route::delete('/delete-course/{id}', [CoursesController::class, 'delete'])->name('deleteCourse');
                //Lesson routes
                Route::post('/create-lesson/{course_id}', [lessonController::class, 'create'])->name('createLesson');
                Route::post('/update-lesson/{id}', [lessonController::class, 'update'])->name('updateLesson');
                Route::delete('/delete-lesson/{id}', [lessonController::class, 'delete'])->name('deleteLesson');
                Route::get('/lessons/{course_id}', [lessonController::class, 'index'])->name('indexLessonsByCourse');
                Route::get('/lesson/{id}', [lessonController::class, 'show'])->name('showLesson');
                //quiz routes 
                Route::post('/create-quiz', [quizController::class, 'createQuiz'])->name('createQuiz');
                Route::post('/add-question', [quizController::class, 'addQuestion'])->name('addQuestion');
                Route::post('/update-quiz/{id}', [quizController::class, 'updateQuiz'])->name('updateQuiz');
                Route::post('/update-question/{id}', [quizController::class, 'updateQuestion'])->name('updateQuestion');
                Route::delete('/delete-quiz/{id}', [quizController::class, 'deleteQuiz'])->name('deleteQuiz');
                Route::delete('/delete-question/{id}', [quizController::class, 'deleteQuestion'])->name('deleteQuestion');
                Route::get('/quizzes/{course_id}', [quizController::class, 'indexQuizzesByCourse'])->name('indexQuizzesByCourse');
            });

            //****************************User routes*******************************
            Route::middleware(['role:user,admin,superAdmin'])->prefix('user')->name('user.')->group(function () {
                //profile routes
                Route::get('/getMyCourses', [UserProfileController::class, 'getMyCourses'])->name('getMyCourses');
                Route::get('/profile', [UserProfileController::class, 'profile'])->name('userProfile');
                Route::post('/update-profile', [UserProfileController::class, 'updateProfile'])->name('updateUserProfile');
                Route::post('/change-password', [UserProfileController::class, 'changePassword'])->name('changeUserPassword');
                //cart 
                Route::post('/addToCart', [CartController::class, 'addToCart'])->name('addToCart');
                Route::delete('/deleteFromCart/{course_id}', [CartController::class, 'deleteFromCart'])->name('deleteFromCart');
                Route::get('/viewCart', [CartController::class, 'viewCart'])->name('viewCart');
                //order
                Route::post('/placeOrder', [OrderController::class, 'placeOrder'])->name('placeOrder');
                Route::get('/viewOrders', [OrderController::class, 'viewOrders'])->name('viewOrders');
                //watched lessons
                Route::get('/my-courses-watched', [WatchedLessonController::class, 'myCourses'])->name('myCourses');
                Route::get('/getCourseContent/{id}', [WatchedLessonController::class, 'getCourseContent'])->name('getCourseContent');
                Route::get('/start-lesson/{id}', [WatchedLessonController::class, 'startLesson'])->name('startLesson');
                Route::get('/getHistory', [WatchedLessonController::class, 'getHistory'])->name('getHistory');
                //favorite course management
                Route::get('/addFavoriteCourse/{id}', [favoriteController::class, 'addFavoriteCourse'])->name('addFavoriteCourse');
                Route::get('/getFavoriteCourse', [favoriteController::class, 'getFavoriteCourse'])->name('getFavoriteCourse');
                Route::delete('/deleteCourse/{id}', [favoriteController::class, 'deleteFavoriteCourse'])->name('deleteFavoriteCourse');
                //favorite lesson management
                Route::get('/addFavoriteLesson/{id}', [favoriteController::class, 'addFavoriteLesson'])->name('addFavoriteLesson');
                Route::get('/getFavoriteLesson', [favoriteController::class, 'getFavoriteLesson'])->name('getFavoriteLesson');
                Route::delete('/deleteLesson/{id}', [favoriteController::class, 'deleteFavoriteLesson'])->name('deleteFavoriteLesson');
                //Messages
                Route::post('/sendMessage', [ChatController::class, 'sendMessage'])->name('sendMessage');
                Route::get('/getInbox', [ChatController::class, 'getInbox'])->name('getInbox');
                Route::get('/getMessages/{conversationId}', [ChatController::class, 'getMessages'])->name('getMessages');
                //Messages Admin
            });
        });
    }
);
