<?php

namespace App\Events;

use App\Models\GroupeMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupeMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;


    /**
     * Create a new event instance.
     */
    public function __construct(GroupeMessage $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): Channel
    {
        //return new PrivateChannel('groupe-messages.' . $this->message->groupe_id);
        return new PresenceChannel('groupe-messages.' . $this->message->groupe_id);


    }

    public function broadcastWith()
    {
        return ['message' => $this->message->append('time')->load('user')];
    }
}
