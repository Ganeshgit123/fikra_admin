import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
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
        link: '/projects'
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
        link: '/creators'
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
                id: 11,
                label: 'MENUITEMS.FAQ.TEXT',
                link: '/faq',
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
        ]
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
 
    // {
    //     id: 49,
    //     label: 'MENUITEMS.FORMS.TEXT',
    //     icon: 'ri-eraser-fill',
    //     subItems: [
    //         {
    //             id: 50,
    //             label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
    //             link: '/form/elements',
    //             parentId: 49
    //         },
    //         {
    //             id: 52,
    //             label: 'MENUITEMS.FORMS.LIST.ADVANCED',
    //             link: '/form/advanced',
    //             parentId: 49
    //         },
    //     ]
    // },
    // {
    //     id: 57,
    //     label: 'MENUITEMS.TABLES.TEXT',
    //     icon: 'ri-table-2',
    //     link: '/tables/advanced'
    // }
];
