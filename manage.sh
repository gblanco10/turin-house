#!/bin/bash

ProgName=$(basename $0)

execute(){
    Action=$1
    Target=$2
    export BUILD_TARGET=$Target
    set -a
    source ./envs/$Target.env
    set +a
    shift 2
    echo "Executing action: $Action - Build target: $BUILD_TARGET"
    docker-compose -p turin-house -f docker-compose.yml $Action $@
}

cmd_help(){
    echo "Usage: $ProgName <subcommand> [options]\n"
    echo "Subcommands:"
    echo "    build [dev/prod] [compose args]"
    echo "    run [dev/prod] [compose args]"
    echo "    backup [dev/prod] [compose args]"
    echo "    restore [dev/prod] [compose args]"
    echo ""
    echo "For help with each subcommand run:"
    echo "$ProgName <subcommand> -h|--help"
    echo ""
}

cmd_init(){
    echo "Good day people, building all submodules while checking out from MASTER branch."
    git submodule update --init
    git submodule foreach git checkout master
    git submodule foreach git pull origin master
}

cmd_build(){
    echo "Building images..."
    Target=$1
    shift
    execute build $Target $@
}

cmd_run(){
    echo "Running project..."
    Target=$1
    shift
    execute up $Target $@
}

cmd_stop(){
    echo "Testing deployment configuration..."
    Target=$1
    shift
    execute stop $Target $@
}

cmd_clean(){
    echo "Cleaning up containers..."
    docker container prune -f
    echo "Cleaning up volumes..."
    docker volume prune -f
    echo "Cleaning up images..."
    docker image prune -f
}

subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        cmd_help
        ;;
    *)
        shift
        cmd_${subcommand} $@
        echo "Done!"
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "       Run '$ProgName --help' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac