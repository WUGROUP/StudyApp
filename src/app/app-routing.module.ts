import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AppComponent } from './app.component';
import { TextboxinfoComponent } from './components/textbox/textboxinfo/textboxinfo.component';
import { WordCourseComponent } from './components/word-course/word-course.component';
import { SentenceCourseComponent } from './components/sentence-course/sentence-course.component';
import { TestManagerComponent } from './components/test-manager/test-manager.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { TestComponent } from './components/test/test.component';
import { SelectCourseComponent } from './components/select-course/select-course.component';


const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'MainPage', component: MainPageComponent },
  { path: 'TextBoxManager', component: TextboxinfoComponent },
  { path: 'WordCourse', component: WordCourseComponent },
  { path: 'SentenceCourse', component: SentenceCourseComponent },
  { path: 'TestManager', component: TestManagerComponent },
  { path: 'CreateTest', component: CreateTestComponent },
  { path: 'Test', component: TestComponent },
  { path: 'SelectCourse', component: SelectCourseComponent },
  { path: '**', component: MainPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
