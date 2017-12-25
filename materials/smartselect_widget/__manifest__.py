# -*- coding: utf-8 -*-
{
    'name': 'SmartSelect Widget',
    'version': '1.0.1',
    'category': 'Widget',
    'description': """
    Feature:
        - Ask server for selectable values

    How to use:
        - Adding widget="SmartSelect" attribute for your field on view
        Ex: <field name="fieldname" widget="SmartSelect" model="myModel" />

    """,
    'author': 'AdvDocs',
    'depends': [
        'web',
    ],

    'data': [
        'views/assets.xml'
    ],

    'qweb': ['static/src/xml/smartselect_widget.xml'],
    'js': [],
    'test': [],
    'demo': [],

    'installable': True,
    'active': False,
    'application': True,
}
