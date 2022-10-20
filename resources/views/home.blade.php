@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('You are logged in!') }}
                    <ul>
                        <li>
                            <a href="/testHome">Test Route with init app</a>
                        </li>
                        <li>
                            <a href="/threejs">ThreeJS APP</a>
                        </li>
                        <li>
                            <a href="/playground">Modal Playground</a>
                        </li>
                        <li>
                            <a href="/one-world">one World app</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
