import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HeaderComponent } from './pages/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllMaterialModule } from './all-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextboxinfoComponent, TextInfoDialog } from './components/textbox/textboxinfo/textboxinfo.component';
import { ComfirmDialogComponent } from './components/comfirm-dialog/comfirm-dialog.component';
import { WordCourseComponent } from './components/word-course/word-course.component';
import { SentenceCourseComponent } from './components/sentence-course/sentence-course.component';
import { TestManagerComponent } from './components/test-manager/test-manager.component';
import { TypePipe } from './pipe/type-pipe';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { CreateTitleDialogComponent } from './components/create-title-dialog/create-title-dialog.component';
import { TodoTestComponent } from './components/todo-test/todo-test.component';
import { TestComponent } from './components/test/test.component';
import { ScoreDialogComponent } from './components/score-dialog/score-dialog.component';
import { TestResultComponent } from './components/test-result/test-result.component';
import { TestResDetailComponent } from './components/test-res-detail/test-res-detail.component';
import { SelectCourseComponent } from './components/select-course/select-course.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    TextboxinfoComponent,
    TextInfoDialog,
    ComfirmDialogComponent,
    WordCourseComponent,
    SentenceCourseComponent,
    TestManagerComponent,
    TypePipe,
    CreateTestComponent,
    LoginDialogComponent,
    CreateTitleDialogComponent,
    TodoTestComponent,
    TestComponent,
    ScoreDialogComponent,
    TestResultComponent,
    TestResDetailComponent,
    SelectCourseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AllMaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  entryComponents: [
    LoginDialogComponent,
    TextInfoDialog,
    ComfirmDialogComponent,
    CreateTitleDialogComponent,
    ScoreDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
