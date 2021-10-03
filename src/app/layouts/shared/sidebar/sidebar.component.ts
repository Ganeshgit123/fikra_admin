import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import MetisMenu from 'metismenujs/dist/metismenujs';
import { Router, NavigationEnd } from '@angular/router';

import { EventService } from '../../../core/services/event.service';


import { MenuItem } from './menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  menu: any;
  hide = false;

  menuItems = [];

  @ViewChild('sideMenu') sideMenu: ElementRef;

  constructor(private eventService: EventService, private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
      }
    });
  }

  ngOnInit(): void {
    this.initialize();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      this.hide = true;
    }
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);

    this._activateMenuDropdown();
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;

    const paths = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      paths.push(links[i]['pathname']);
    }
    const itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }

    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.add('mm-active');

        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;

          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');

            if (childAnchor) { childAnchor.classList.add('mm-active'); }
            if (childDropdown) { childDropdown.classList.add('mm-active'); }

            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') { childanchor.classList.add('mm-active'); }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Initialize
   */
  initialize(): void {
    
    this.menuItems = [
      {
          id: 1,
          label: 'MENUITEMS.MENU.TEXT',
          isTitle: true
      },
      {
          id: 2,
          label: 'MENUITEMS.DASHBOARDS.TEXT',
          icon: 'ri-dashboard-line',
          link: '/dashboard'
      },
      {
          id: 3,
          label: 'MENUITEMS.PROJECTS.TEXT',
          icon: 'ri-stack-fill',
          subItems: [
              {
                  id: 22,
                  label: 'MENUITEMS.PROJECTS_LIST.TEXT',
                  link: '/projects',
                  parentId: 3
              },
              {
                  id: 23,
                  label: 'MENUITEMS.REQUESTED_LIST.TEXT',
                  link: '/requested_projects',
                  parentId: 3
              },
              {
                  id: 24,
                  label: 'MENUITEMS.RECOMMENDED_LIST.TEXT',
                  link: '/recommended_projects',
                  parentId: 3
              },
              {
                  id: 30,
                  label: 'MENUITEMS.PROJECT_REPORTS.TEXT',
                  link: '/project_reports',
                  parentId: 3
              },
          ]
      },
      {
          id: 4,
          label: 'MENUITEMS.INVESTORS.TEXT',
          icon: 'mdi mdi-account-cash',
          link: '/investors'
      },
      {
          id: 6,
          label: 'MENUITEMS.CREATORS.TEXT',
          icon: 'mdi mdi-account-cog',
          subItems: [
              {
                  id: 40,
                  label: 'MENUITEMS.CREATORS_LIST.TEXT',
                  link: '/creators',
                  parentId: 6
              },
              {
                  id: 41,
                  label: 'MENUITEMS.BANK_REQUESTS.TEXT',
                  link: '/bank_ac_request_lists',
                  parentId: 6
              },
          ]
      },
      {
          id: 7,
          label: 'MENUITEMS.CMS.TEXT',
          icon: 'mdi mdi-file-document-edit',
          subItems: [
              {
                  id: 8,
                  label: 'MENUITEMS.HOMEPAGE.TEXT',
                  link: '/home_page',
                  parentId: 6
              },
              {
                  id: 9,
                  label: 'MENUITEMS.ABOUTPAGE.TEXT',
                  link: '/about_page',
                  parentId: 6
              },
              {
                  id: 10,
                  label: 'MENUITEMS.STARTPROJECT.TEXT',
                  link: '/start_project_page',
                  parentId: 6
              },
              {
                  id: 10,
                  label: 'MENUITEMS.CREATEPROJECT.TEXT',
                  link: '/create_project',
                  parentId: 6
              },
              {
                  id: 10,
                  label: 'MENUITEMS.PROJECTCONTENT.TEXT',
                  link: '/project_content',
                  parentId: 6
              },
              {
                  id: 24,
                  label: 'MENUITEMS.CREATOR_HANDBOOK.TEXT',
                  link: '/creator_handbook',
                  parentId: 6
              },
              {
                  id: 25,
                  label: 'MENUITEMS.CONTACT_US.TEXT',
                  link: '/contact',
                  parentId: 6
              },
              {
                  id: 29,
                  label: 'MENUITEMS.CAREER.TEXT',
                  link: '/career',
                  parentId: 6
              },
              {
                  id: 11,
                  label: 'MENUITEMS.FAQ.TEXT',
                  link: '/faq',
                  parentId: 6
              },
              {
                  id: 42,
                  label: 'MENUITEMS.HELP_GUIDES.TEXT',
                  link: '/help_guide',
                  parentId: 6
              },
              {
                  id: 12,
                  label: 'MENUITEMS.PRIVACYPOLICY.TEXT',
                  link: '/privacy',
                  parentId: 6
              },
              {
                  id: 13,
                  label: 'MENUITEMS.COOKIEPOLICY.TEXT',
                  link: '/cookie_policy',
                  parentId: 6
              },
              {
                  id: 14,
                  label: 'MENUITEMS.TERMSOFUSE.TEXT',
                  link: '/terms_of_use',
                  parentId: 6
              },
          ]
      },
      {
          id: 15,
          label: 'MENUITEMS.SETTINGS.TEXT',
          icon: 'ri-settings-5-line',
          subItems: [
              {
                  id: 37,
                  label: 'MENUITEMS.COMMISSION_CHARGES.TEXT',
                  link: '/commission_charges',
                  parentId: 13
              },
              {
                  id: 16,
                  label: 'MENUITEMS.CATEGORY_SUB_CATEGORY.TEXT',
                  link: '/category_sub_category',
                  parentId: 13
              },
              {
                  id: 17,
                  label: 'MENUITEMS.COUNTRY_CITY.TEXT',
                  link: '/country_city',
                  parentId: 13
              },
              {
                  id: 18,
                  label: 'MENUITEMS.TAGGS.TEXT',
                  link: '/tags',
                  parentId: 13
              },
              {
                  id: 26,
                  label: 'MENUITEMS.SPECIAL_SERVICES.TEXT',
                  link: '/special_services',
                  parentId: 13
              },
          ]
      },
      {
          id: 32,
          label: 'MENUITEMS.ROLES & PERMISSION.TEXT',
          icon: '  fas fa-user-lock',
          subItems: [
              {
                  id: 33,
                  label: 'MENUITEMS.ROLES.TEXT',
                  link: '/roles',
                  parentId: 32
              },
              {
                  id: 44,
                  label: 'MENUITEMS.WRITEREQUESTS.TEXT',
                  link: '/user_write_request',
                  parentId: 32
              },
          ]
      },
      {
          id: 35,
          label: 'MENUITEMS.ADMIN_USERS.TEXT',
          icon: 'mdi mdi-account-cog',
          link: '/admin_users'
      },
      {
          id: 19,
          label: 'MENUITEMS.SIGNUPFORM.TEXT',
          icon: 'ri-eraser-fill',
          subItems: [
              {
                  id: 20,
                  label: 'MENUITEMS.INVESTORS_FORM.TEXT',
                  link: '/investor_form',
                  parentId: 19
              },
              {
                  id: 21,
                  label: 'MENUITEMS.CREATORS_FORM.TEXT',
                  link: '/creator_form',
                  parentId: 19
              },
          ]
      },
      {
          id: 27,
          label: 'MENUITEMS.SPECIAL_REQUESTS.TEXT',
          icon: ' ri-external-link-fill',
          link: '/special_requests'
      },
      {
          id: 43,
          label: 'MENUITEMS.REPORTS.TEXT',
          icon: ' ri-file-list-3-fill',
          link: '/reports'
      },
      {
          id: 38,
          label: 'MENUITEMS.TEMPLATES.TEXT',
          icon: ' ri-layout-3-line',
          link: '/template'
      },
      {
          id: 28,
          label: 'MENUITEMS.SUBSCRIBERS.TEXT',
          icon: ' ri-user-shared-fill',
          link: '/subscribers'
      },
      {
          id: 36,
          label: 'MENUITEMS.INVOICE_BILL.TEXT',
          icon: 'fas fa-file-invoice',
          link: '/bill_list'
      },
      {
          id: 39,
          label: 'MENUITEMS.SMSCAMPAIGN.TEXT',
          icon: ' ri-message-2-line',
          link: '/sms_campaign'
      },
      {
          id: 45,
          label: 'MENUITEMS.TRANSLATION.TEXT',
          icon: 'fas fa-language',
          link: '/translation'
      },
      {
          id: 31,
          label: 'MENUITEMS.NOTIFICATIONS.TEXT',
          icon: 'ri-notification-4-line',
          link: '/notifications'
      },
  ];

//   var withoutRole = this.menuItems.filter(function(value) { return value.id != '32'  });
// console.log(withoutRole);



  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }

  /**
   * Light sidebar
   */
  lightSidebar() {
    document.body.setAttribute('data-sidebar', 'light');
    document.body.setAttribute('data-topbar', 'dark');
    document.body.removeAttribute('data-sidebar-size');
    document.body.removeAttribute('data-layout-size');
    document.body.removeAttribute('data-keep-enlarged');
    document.body.classList.remove('vertical-collpsed');
  }

  // /**
  //  * Compact sidebar
  //  */
  // compactSidebar() {
  //   document.body.setAttribute('data-sidebar-size', 'small');
  //   document.body.setAttribute('data-sidebar', 'dark');
  //   document.body.removeAttribute('data-topbar');
  //   document.body.removeAttribute('data-layout-size');
  //   document.body.removeAttribute('data-keep-enlarged');
  //   document.body.classList.remove('sidebar-enable');
  //   document.body.classList.remove('vertical-collpsed');
  // }

  /**
   * Icon sidebar
   */
  // iconSidebar() {
  //   document.body.classList.add('sidebar-enable');
  //   document.body.classList.add('vertical-collpsed');
  //   document.body.setAttribute('data-sidebar', 'dark');
  //   document.body.removeAttribute('data-layout-size');
  //   document.body.removeAttribute('data-keep-enlarged');
  //   document.body.removeAttribute('data-topbar');
  // }

  /**
   * Boxed layout
   */
  // boxedLayout() {
  //   document.body.setAttribute('data-keep-enlarged', 'true');
  //   document.body.setAttribute('data-layout-size', 'boxed');
  //   document.body.setAttribute('data-sidebar', 'dark');
  //   document.body.classList.add('vertical-collpsed');
  //   document.body.classList.remove('sidebar-enable');
  //   document.body.removeAttribute('data-topbar');
  // }

  // /**
  //  * Colored sidebar
  //  */
  // coloredSidebar() {
  //   document.body.setAttribute('data-sidebar', 'colored');
  //   document.body.removeAttribute('data-sidebar-size');
  //   document.body.removeAttribute('data-layout-size');
  //   document.body.classList.remove('vertical-collpsed');
  //   document.body.removeAttribute('data-topbar');
  // }

}
