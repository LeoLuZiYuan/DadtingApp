import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  standalone: true,
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [GalleryModule, TabsModule, CommonModule] //TimeageModule, MemberMessageComponent
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;

  images: GalleryItem[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();

    this.getImage();
  }

  getImage() {
    if (!this.member) return [];
    const imageUrls = [];
    for (const photo of this.member.photos) {
      // already use lastest ngx-gallery
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
    }
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        // this.galleryImages = this.getImage();
      }
    })
  }

}
