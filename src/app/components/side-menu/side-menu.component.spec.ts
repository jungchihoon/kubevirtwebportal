import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SideMenuComponent } from './side-menu.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SideMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    component.networkCheck = true;
    component.capkCheck = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set brand-text', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.brand-text'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue.textContent).toContain('kubevirt-manager');
  });
  it('should contain Dashboard item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-tachometer-alt'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Virtual Machines item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-desktop'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain VM Pools item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-server'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Nodes item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-hdd'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Data Volumes item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-database'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Instance Types item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-book'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Load Balancers item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-sitemap'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Network item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-network-wired'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Auto Scaling item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-expand-alt'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Cluster item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-cubes'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
});
