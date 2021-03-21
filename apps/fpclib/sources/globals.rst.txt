#######
Globals
#######

.. contents:: Quick Links
   :local:

Constants
=========

Regexes
-------

:hide:`INVALID_CHARS`
^^^^^^^^^^^^^^^^^^^^^

.. autodata:: INVALID_CHARS
   :annotation:

:hide:`INVALID_CHARS_NO_SLASH`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. autodata:: INVALID_CHARS_NO_SLASH
   :annotation:

:hide:`DATE`
^^^^^^^^^^^^

.. autodata:: DATE
   :annotation:

:hide:`PORT`
^^^^^^^^^^^^

.. autodata:: PORT
   :annotation:

:hide:`WAYBACK_LINK`
^^^^^^^^^^^^^^^^^^^^
   
.. autodata:: WAYBACK_LINK
   :annotation:

:hide:`PROTOCOL`
^^^^^^^^^^^^^^^^

.. autodata:: PROTOCOL
   :annotation:

:hide:`PROPER_PROTOCOL`
^^^^^^^^^^^^^^^^^^^^^^^

.. autodata:: PROPER_PROTOCOL
   :annotation:

:hide:`EXTENSION`
^^^^^^^^^^^^^^^^^

.. autodata:: EXTENSION
   :annotation:

:hide:`UUID`
^^^^^^^^^^^^

.. autodata:: UUID
   :annotation:

:hide:`STARTING_PARENTHESES`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. autodata:: STARTING_PARENTHESES
   :annotation:

Application Paths
-----------------

:hide:`SECURE_PLAYER`
^^^^^^^^^^^^^^^^^^^^^

.. autodata:: SECURE_PLAYER

:hide:`JAVA`
^^^^^^^^^^^^

.. autodata:: JAVA

:hide:`JAVA_IN_BROWSER`
^^^^^^^^^^^^^^^^^^^^^^^

.. autodata:: JAVA_IN_BROWSER

:hide:`BASILISK`
^^^^^^^^^^^^^^^^

.. autodata:: BASILISK

:hide:`FLASH_PLAYERS`
^^^^^^^^^^^^^^^^^^^^^

.. autodata:: FLASH_PLAYERS
   :annotation:

:hide:`FLASH`
^^^^^^^^^^^^^

.. autodata:: FLASH

:hide:`SHOCKWAVE_PLAYERS`
^^^^^^^^^^^^^^^^^^^^^^^^^

.. autodata:: SHOCKWAVE_PLAYERS
   :annotation:

:hide:`SHOCKWAVE`
^^^^^^^^^^^^^^^^^

.. autodata:: SHOCKWAVE

:hide:`UNITY`
^^^^^^^^^^^^^

.. autodata:: UNITY

:hide:`ACTIVE_X`
^^^^^^^^^^^^^^^^

.. autodata:: ACTIVE_X

:hide:`GROOVE`
^^^^^^^^^^^^^^

.. autodata:: GROOVE

:hide:`SVR`
^^^^^^^^^^^

.. autodata:: SVR

:hide:`APPLICATIONS`
^^^^^^^^^^^^^^^^^^^^

.. autodata:: APPLICATIONS

Flags
-----

:hide:`EVERYTHING`
^^^^^^^^^^^^^^^^^^

.. autodata:: EVERYTHING
   :annotation: = int('1111', 2)

:hide:`META`
^^^^^^^^^^^^

.. autodata:: META
   :annotation: = int('1000', 2)

:hide:`IMAGES`
^^^^^^^^^^^^^^

.. autodata:: IMAGES
   :annotation: = int('0110', 2)

:hide:`LOGO`
^^^^^^^^^^^^

.. autodata:: LOGO
   :annotation: = int('0100', 2)

:hide:`SS`
^^^^^^^^^^

.. autodata:: SS
   :annotation: = int('0010', 2)

:hide:`CONTENT`
^^^^^^^^^^^^^^^

.. autodata:: CONTENT
   :annotation: = int('0001', 2)

Other
-----

:hide:`LANGUAGES`
^^^^^^^^^^^^^^^^^

.. autodata:: LANGUAGES

:hide:`LIBRARIES`
^^^^^^^^^^^^^^^^^

.. autodata:: LIBRARIES

:hide:`PLAY_MODES`
^^^^^^^^^^^^^^^^^^

.. autodata:: PLAY_MODES

:hide:`STATUSES`
^^^^^^^^^^^^^^^^

.. autodata:: STATUSES

:hide:`MONTHS`
^^^^^^^^^^^^^^

.. autodata:: MONTHS

Other
=====

:hide:`DEBUG_LEVEL`
-------------------

.. autodata:: DEBUG_LEVEL

:hide:`TABULATION`
------------------

.. autodata:: TABULATION

:hide:`PLATFORMS`
-----------------

.. autodata:: PLATFORMS
   :annotation:

:hide:`TAGS`
------------

.. autodata:: TAGS
   :annotation:

Exceptions
==========

:hide:`InvalidCharacterError`
-----------------------------

.. autoclass:: InvalidCharacterError

:hide:`InvalidFileError`
-------------------------

.. autoclass:: InvalidFileError

:hide:`EmptyLocationError`
--------------------------

.. autoclass:: EmptyLocationError

:hide:`InvalidMetadataError`
----------------------------

.. autoclass:: InvalidMetadataError

Functions
=========

Internet
--------

:hide:`download()`
^^^^^^^^^^^^^^^^^^

.. autofunction:: download

:hide:`download_all()`
^^^^^^^^^^^^^^^^^^^^^^

.. autofunction:: download_all

:hide:`download_image()`
^^^^^^^^^^^^^^^^^^^^^^^^

.. autofunction:: download_image

:hide:`normalize()`
^^^^^^^^^^^^^^^^^^^

.. autofunction:: normalize

:hide:`read_url()`
^^^^^^^^^^^^^^^^^^

.. autofunction:: read_url

:hide:`get_soup()`
^^^^^^^^^^^^^^^^^^

.. autofunction:: get_soup

:hide:`get_fpdata()`
^^^^^^^^^^^^^^^^^^^^

.. autofunction:: get_fpdata

File IO
-------

:hide:`read()`
^^^^^^^^^^^^^^

.. autofunction:: read

:hide:`read_lines()`
^^^^^^^^^^^^^^^^^^^^

.. autofunction:: read_lines

:hide:`read_table()`
^^^^^^^^^^^^^^^^^^^^

.. autofunction:: read_table

:hide:`make_dir()`
^^^^^^^^^^^^^^^^^^

.. autofunction:: make_dir

:hide:`delete()`
^^^^^^^^^^^^^^^^^^

.. autofunction:: delete

:hide:`write()`
^^^^^^^^^^^^^^^

.. autofunction:: write

:hide:`write_line()`
^^^^^^^^^^^^^^^^^^^^

.. autofunction:: write_line

:hide:`write_table()`
^^^^^^^^^^^^^^^^^^^^^

.. autofunction:: write_table

:hide:`scan_dir()`
^^^^^^^^^^^^^^^^^^

.. autofunction:: scan_dir

:hide:`replace()`
^^^^^^^^^^^^^^^^^

.. autofunction:: replace

:hide:`hash256()`
^^^^^^^^^^^^^^^^^

.. autofunction:: hash256

:hide:`hash()`
^^^^^^^^^^^^^^

.. autofunction:: hash

Curating
--------

:hide:`test()`
^^^^^^^^^^^^^^

.. autofunction:: test

:hide:`update()`
^^^^^^^^^^^^^^^^

.. autofunction:: update

:hide:`debug()`
^^^^^^^^^^^^^^^

.. autofunction:: debug

:hide:`clear_save()`
^^^^^^^^^^^^^^^^^^^^

.. autofunction:: clear_save

:hide:`curate()`
^^^^^^^^^^^^^^^^

.. autofunction:: curate

:hide:`curate_regex()`
^^^^^^^^^^^^^^^^^^^^^^

.. autofunction:: curate_regex

:hide:`load()`
^^^^^^^^^^^^^^

.. autofunction:: load
