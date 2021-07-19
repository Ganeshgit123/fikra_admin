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
        icon: 'fas fa-project-diagram',
        link: '/projects'
    },
    {
        id: 4,
        label: 'MENUITEMS.INVESTORS.TEXT',
        icon: 'mdi mdi-account-cash',
        link: '/investors'
    },
    {
        id: 5,
        label: 'MENUITEMS.CREATORS.TEXT',
        icon: 'mdi mdi-account-cog',
        link: '/creators'
    },
    {
        id: 6,
        label: 'MENUITEMS.CMS.TEXT',
        icon: 'mdi mdi-file-document-edit',
        subItems: [
            {
                id: 7,
                label: 'MENUITEMS.HOMEPAGE.TEXT',
                link: '/home_page',
                parentId: 6
            },
            {
                id: 8,
                label: 'MENUITEMS.ABOUTPAGE.TEXT',
                link: '/about_page',
                parentId: 6
            },
            {
                id: 9,
                label: 'MENUITEMS.STARTPROJECT.TEXT',
                link: '/start_project_page',
                parentId: 6
            },
            {
                id: 10,
                label: 'MENUITEMS.FAQ.TEXT',
                link: '/faq',
                parentId: 6
            },
            {
                id: 11,
                label: 'MENUITEMS.PRIVACYPOLICY.TEXT',
                link: '/privacy',
                parentId: 6
            },
            {
                id: 12,
                label: 'MENUITEMS.COOKIEPOLICY.TEXT',
                link: '/cookie_policy',
                parentId: 6
            },
            {
                id: 13,
                label: 'MENUITEMS.TERMSOFUSE.TEXT',
                link: '/terms_of_use',
                parentId: 6
            },
        ]
    },
    {
        id: 14,
        label: 'MENUITEMS.SETTINGS.TEXT',
        icon: 'ri-settings-5-line',
        subItems: [
            {
                id: 15,
                label: 'MENUITEMS.CATEGORY_SUB_CATEGORY.TEXT',
                link: '/category_sub_category',
                parentId: 13
            },
        ]
    },
    {
        id: 16,
        label: 'MENUITEMS.FORMFIELDEDIT.TEXT',
        icon: 'ri-eraser-fill',
        link: '/form-field-edit'
    },
 
    {
        id: 49,
        label: 'MENUITEMS.FORMS.TEXT',
        icon: 'ri-eraser-fill',
        subItems: [
            {
                id: 50,
                label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
                link: '/form/elements',
                parentId: 49
            },
            {
                id: 52,
                label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                link: '/form/advanced',
                parentId: 49
            },
        ]
    },
    {
        id: 57,
        label: 'MENUITEMS.TABLES.TEXT',
        icon: 'ri-table-2',
        link: '/tables/advanced'
    }
];
