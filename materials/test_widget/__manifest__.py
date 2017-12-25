# -*- coding: utf-8 -*-
{
    'name': 'Test Widget',
    'version': '1.0.1',
    'category': 'Widget',
    'description': """
    Feature:
        - Test widget for form view

    How to use:
        - Put
        <widget type="TestWidget" />

    """,
    'author': 'AdvDocs',
    'depends': [
        'web',
    ],

    'data': [
        'views/assets.xml'
    ],

    'qweb': ['static/src/xml/test_widget.xml'],
    'js': [],
    'test': [],
    'demo': [],

    'installable': True,
    'active': False,
    'application': True,
}
