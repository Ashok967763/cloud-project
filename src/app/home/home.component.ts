import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import { first } from 'rxjs/operators';
import {Observable} from 'rxjs';

import { User } from '@/_models';
import {AlertService, UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    @ViewChild('fileInput',{static:false}) 
    fileInput : ElementRef
    currentUser: User;
    registerForm: FormGroup;
    filedata : FormGroup
    users = [];
    loading = false;
    file: File = null; 
    fileWordCount = 0
    uploadedFile = '';

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
        console.log("curr-->",this.currentUser)
            this.filedata = this.formBuilder.group({
                file: new FormControl(null),
            });
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    onSelectFile(fileInput: any) {
        this.file = <File>fileInput.target.files[0];
      }

    download() {
        console.log("-->",this.currentUser)
    this.userService.download(this.currentUser.file)
        .pipe(first())
        .subscribe(
        );
    }

    onUpload() {
        this.loading = !this.loading;
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('email', this.currentUser.email);
        formData.append('firstName', this.currentUser.firstName);
        // formData.append('id', this.currentUser.id);
        formData.append('lastName', this.currentUser.lastName);
        formData.append('username', this.currentUser.username);
        console.log(this.file);
        this.userService.update(this.currentUser.id,formData)
            .pipe(first())
            .subscribe(
                data => {
                    console.log("--->data-->",data);
                    this.currentUser.file = JSON.parse(JSON.stringify(data)).file
                    console.log("--->data-->",this.currentUser);
                    this.alertService.success('File Uploaded successful', true);
                    this.uploadedFile=this.file.name;
                    const reader = new FileReader();
                    reader.onload = function() {
                        const text = reader.result;
                        const wordCount = (text as string).trim().split(/\s+/).length;
                        var s = (document.getElementById("display_File_count") as HTMLInputElement);
                        s.innerHTML = JSON.stringify(wordCount);
                        }
                        reader.readAsText(this.file);

                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
    

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}