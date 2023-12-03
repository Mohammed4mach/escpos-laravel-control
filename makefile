all: run

run:
	electron .

build:
	git clone git@github.com:Mohammed4mach/escpos-server-laravel.git ./bin/escpos-server-laravel

