#######
Classes
#######

.. contents:: Quick Links
   :local:

Curation
========

.. autoclass:: Curation
   
Attributes
----------

:hide:`RESERVED_APPS`
^^^^^^^^^^^^^^^^^^^^^

.. autoattribute:: Curation.RESERVED_APPS

:hide:`ARGS`
^^^^^^^^^^^^

.. autoattribute:: Curation.ARGS
   :annotation:

Member Fields
-------------

:hide:`meta`
^^^^^^^^^^^^

.. attribute:: Curation.meta
   :type: dict
   
   An ordered dictionary containing all metadata for the curation. While you can modify it directly, it is recommended that you use :func:`Curation.set_meta()` and :func:`Curation.get_meta()` instead.

:hide:`args`
^^^^^^^^^^^^

.. attribute:: Curation.args
   :type: dict
   
   A dictionary containing all arguments passed in through :func:`Curation.set_meta()` that do not map to any metadata. You can use this to pass in extra information that you want to use in :func:`Curation.parse()` or other methods for custom classes.

:hide:`logo`
^^^^^^^^^^^^

.. attribute:: Curation.logo
   :type: str
   :value: None
   
   A url pointing to an image to be used as the logo for this curation. Any non-PNG files will be converted into PNG files when downloaded. You can modify it at will.

:hide:`ss`
^^^^^^^^^^

.. attribute:: Curation.ss
   :type: str
   :value: None
   
   A url pointing to an image to be used as the screenshot for this curation. Any non-PNG files will be converted into PNG files when downloaded. You can modify it at will.

:hide:`id`
^^^^^^^^^^

.. attribute:: Curation.id
   :type: str
   :value: str(uuid.uuid4())
   
   A string UUID identifying this curation. By default this is the name of the folder the curation will be saved to when Curation.save() is called. You can re-generate an id by using :func:`Curation.new_id()`.

Methods
-------

:hide:`new_id()`
^^^^^^^^^^^^^^^^

.. automethod:: Curation.new_id

:hide:`set_meta()`
^^^^^^^^^^^^^^^^^^

.. automethod:: Curation.set_meta

:hide:`get_meta()`
^^^^^^^^^^^^^^^^^^

.. automethod:: Curation.get_meta

:hide:`add_app()`
^^^^^^^^^^^^^^^^^

.. automethod:: Curation.add_app

:hide:`add_ext()`
^^^^^^^^^^^^^^^^^

.. automethod:: Curation.add_ext

:hide:`add_msg()`
^^^^^^^^^^^^^^^^^

.. automethod:: Curation.add_msg

:hide:`del_app()`
^^^^^^^^^^^^^^^^^

.. automethod:: Curation.del_app

:hide:`get_yaml()`
^^^^^^^^^^^^^^^^^^

.. automethod:: Curation.get_yaml

:hide:`soupify()`
^^^^^^^^^^^^^^^^^

.. automethod:: Curation.soupify

:hide:`parse()`
^^^^^^^^^^^^^^^

.. automethod:: Curation.parse

:hide:`get_files()`
^^^^^^^^^^^^^^^^^^^

.. automethod:: Curation.get_files

:hide:`save_image()`
^^^^^^^^^^^^^^^^^^^^

.. automethod:: Curation.save_image

:hide:`save()`
^^^^^^^^^^^^^^

.. automethod:: Curation.save

:hide:`get_errors()`
^^^^^^^^^^^^^^^^^^^^

.. automethod:: Curation.get_errors

:hide:`check_source()`
^^^^^^^^^^^^^^^^^^^^^^

.. automethod:: Curation.check_source

TestCuration
============

.. autoclass:: TestCuration

BrokenCuration
==============

.. autoclass:: BrokenCuration

DateParser
==========

.. autoclass:: DateParser

Methods
-------

:hide:`parse()`
^^^^^^^^^^^^^^^

.. automethod:: DateParser.parse